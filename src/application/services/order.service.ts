import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  OrderUseCase,
  CreateOrderCommand,
  UpdateOrderStatusCommand,
} from '../ports/in/order.use-case';
import { OrderRepositoryPort } from '../ports/out/order.repository.port';
import { ProductRepositoryPort } from '../ports/out/product.repository.port';
import { Order, OrderItem } from '../../domain/entities/order.entity';
import { OrderStatus } from '@prisma/client';
import { OrderStatus as OrderStatusTS } from '../../domain/enums/order-status.enum';
import { Prisma } from '@prisma/client';
import { TransactionService } from './transaction.service';
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { PaymentGatewayPort } from '../../shared/types/payment.type';
import { CustomerRepositoryPort } from '../ports/out/customer.respository.port';
import { DeliveryRepositoryPort } from '../ports/out/delivery.repository.port';
import { Delivery } from '../../domain/entities/delivery.entity';

@Injectable()
export class OrderService implements OrderUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepositoryPort,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepositoryPort,
    private readonly transactionService: TransactionService,
    @Inject('PaymentGateway')
    private readonly paymentGateway: PaymentGatewayPort,
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject('DeliveryRepository')
    private readonly deliveryRepository: DeliveryRepositoryPort,
  ) {}

  async createOrder(command: CreateOrderCommand): Promise<Order> {
    // Validate products and calculate total
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const item of command.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.title}`,
        );
      }

      orderItems.push({
        id: '',
        orderId: '',
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += Number(product.price) * item.quantity;
    }

    // Validate credit card and get tokenized card
    let tokenizedCard;
    try {
      tokenizedCard = await this.paymentGateway.getTokenizedCard(
        command.paymentInfo.card,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    let customer = await this.customerRepository.findCustomerByEmail(
      command.deliveryInfo.email,
    );

    if (!customer) {
      customer = await this.customerRepository.createCustomer({
        email: command.deliveryInfo.email,
        name: command.deliveryInfo.name,
        address: command.deliveryInfo.address,
        city: command.deliveryInfo.city,
        department: command.deliveryInfo.department,
        contactNumber: command.deliveryInfo.contactNumber,
      });
    }

    let order = new Order();
    order.items = orderItems;
    order.totalAmount = new Prisma.Decimal(totalAmount);
    order.baseAmount = new Prisma.Decimal(totalAmount);
    order.deliveryFee = new Prisma.Decimal(0);
    order.status = OrderStatusTS.PENDING;
    order.customerId = customer.id;

    order = await this.orderRepository.create(order, orderItems);

    try {
      // Process payment
      const transaction = await this.transactionService.processPayment({
        order: order,
        amount: totalAmount,
        paymentInfo: command.paymentInfo,
        tokenizedCard: tokenizedCard,
      });

      // Update order status based on transaction result
      if (
        transaction.status === TransactionStatus.APPROVED ||
        transaction.status === TransactionStatus.PENDING
      ) {
        order = await this.orderRepository.update(order.id, {
          status: this.getOrderStatusFromTransactionStatus(transaction.status),
        });

        const delivery = new Delivery();
        delivery.orderId = order.id;
        delivery.recipientName = command.deliveryInfo.name;
        delivery.address = command.deliveryInfo.address;
        delivery.city = command.deliveryInfo.city;
        delivery.department = command.deliveryInfo.department;
        delivery.contactNumber = command.deliveryInfo.contactNumber;

        await this.deliveryRepository.createDelivery(delivery);

        // Update product stock
        for (const item of command.items) {
          await this.productRepository.update(item.productId, {
            stock: { decrement: item.quantity },
          });
        }
      } else {
        order = await this.orderRepository.update(order.id, {
          status: this.getOrderStatusFromTransactionStatus(transaction.status),
        });
      }

      return order;
    } catch (error) {
      console.error(error);
      await this.orderRepository.update(order.id, {
        status: OrderStatus.CANCELLED,
      });
      throw new BadRequestException(
        error.message || 'Payment processing failed',
      );
    }
  }

  async getOrder(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }

  async updateOrderStatus(command: UpdateOrderStatusCommand): Promise<Order> {
    const order = await this.orderRepository.findById(command.orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${command.orderId} not found`);
    }

    //validates that the state to be transitioned is a correct state
    this.validateStatusTransition(order.status, command.status);

    return await this.orderRepository.update(command.orderId, {
      status: command.status,
    });
  }

  async checkOrderStatus(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const transaction = await this.transactionService.getTransactionByOrderId(
      order.id,
    );

    if (!transaction) {
      throw new NotFoundException(`Transaction for order ${id} not found`);
    }
    if (transaction.status === TransactionStatus.PENDING) {
      const updatedTransaction =
        await this.transactionService.checkTransactionStatus(
          transaction.orderId,
        );

      if (updatedTransaction.status === TransactionStatus.PENDING) {
        return order;
      }

      return await this.orderRepository.update(order.id, {
        status: this.getOrderStatusFromTransactionStatus(
          updatedTransaction.status,
        ),
      });
    }

    return order;
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): void {
    const validTransitions = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.SHIPPED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  getOrderStatusFromTransactionStatus(transactionStatus: any): OrderStatusTS {
    switch (transactionStatus) {
      case TransactionStatus.PENDING:
        return OrderStatusTS.PENDING;
      case TransactionStatus.APPROVED:
        return OrderStatusTS.PAID;
      case TransactionStatus.DECLINED:
        return OrderStatusTS.CANCELLED;
      case TransactionStatus.VOIDED:
        return OrderStatusTS.CANCELLED;
      default:
        return OrderStatusTS.CANCELLED;
    }
  }
}
