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
import { OrderStatus as OrderStatusTS } from 'src/domain/enums/order-status.enum';
import { Prisma } from '@prisma/client';
import { TransactionService } from './transaction.service';
import { TransactionStatus } from 'src/domain/entities/transaction.entity';
import { PaymentGatewayPort } from 'src/shared/types/payment.type';

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

    let order = new Order();
    order.items = orderItems;
    order.totalAmount = new Prisma.Decimal(totalAmount);
    order.status = OrderStatusTS.PENDING;
    order.address = command.deliveryInfo.address;
    order.city = command.deliveryInfo.city;
    order.department = command.deliveryInfo.department;
    order.email = command.deliveryInfo.email;
    order.name = command.deliveryInfo.name;
    order.contactNumber = command.deliveryInfo.contactNumber;
    order.payment_gateway_id = '123456'; // Payment gateway ID

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
