// tests/unit/application/use-cases/order.service.spec.ts
import { OrderService } from '../application/services/order.service';
import { OrderRepositoryPort } from '../application/ports/out/order.repository.port';
import { ProductRepositoryPort } from '../application/ports/out/product.repository.port';
import { PaymentGatewayPort } from '../shared/types/payment.type';
import { CustomerRepositoryPort } from '../application/ports/out/customer.respository.port';
import { DeliveryRepositoryPort } from '../application/ports/out/delivery.repository.port';
import { TransactionRepositoryPort } from '../application/ports/out/transaction.repository.port';
import { Order } from '../domain/entities/order.entity';
import { OrderStatus } from '../domain/enums/order-status.enum';
import { Prisma } from '@prisma/client';
import { TransactionService } from '../application/services/transaction.service';
import { Customer } from '../domain/entities/customer.entity';

describe('OrderService', () => {
  let orderService: OrderService;
  let mockOrderRepository: jest.Mocked<OrderRepositoryPort>;
  let mockProductRepository: jest.Mocked<ProductRepositoryPort>;
  let mockPaymentService: jest.Mocked<PaymentGatewayPort>;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;
  let mockDeliveryRepository: jest.Mocked<DeliveryRepositoryPort>;
  let transactionService: TransactionService;
  let mockTransactionRepository: jest.Mocked<TransactionRepositoryPort>;

  const mockCustomer: Customer = {
    id: '1',
    name: 'Test User',
    email: 'test@test.co',
    contactNumber: '1234567890',
    address: 'Test Address',
    city: 'Test City',
    department: 'Test Department',
    createdAt: new Date(),
    updatedAt: new Date(),
    isRegistered: false,
    password: '',
    orders: [],
  };

  const mockOrder: Order = {
    id: '1',
    status: OrderStatus.PENDING,
    items: [
      {
        id: '1',
        orderId: '1',
        productId: 'prod-1',
        quantity: 2,
        price: new Prisma.Decimal(100),
      },
    ],
    delivery: {
      id: '1',
      orderId: '1',
      status: OrderStatus.PENDING,
      actualDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDate: new Date(),
      trackingNumber: '123456789',
      carrier: 'Test Carrier',
      notes: 'Test Notes',
      address: 'Test Address',
      city: 'Test City',
      department: 'Test Department',
      contactNumber: '1234567890',
      recipientName: 'Test User',
    },
    baseAmount: new Prisma.Decimal(200),
    totalAmount: new Prisma.Decimal(200),
    deliveryFee: new Prisma.Decimal(0),
    transaction: {
      id: '1',
      orderId: '1',
      amount: new Prisma.Decimal(200),
      gatewayTransactionId: '123456789',
      paymentMethod: 'CREDIT_CARD',
      errorMessage: '',
      gatewayResponse: '',
      lastFourDigits: '1234',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    customerId: '1',
    customer: {
      name: 'Test User',
      email: 'test@test.co',
      contactNumber: '1234567890',
      address: 'Test Address',
      city: 'Test City',
      department: 'Test Department',
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isRegistered: false,
      password: '',
      orders: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findOrderItems: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };

    mockProductRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    mockPaymentService = {
      getTransaction: jest.fn(),
      getTokenizedCard: jest.fn(),
      processPayment: jest.fn(),
    };

    mockCustomerRepository = {
      createCustomer: jest.fn(),
      findCustomerByEmail: jest.fn(),
      findCustomerById: jest.fn(),
      updateCustomer: jest.fn(),
    };

    mockTransactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByOrderId: jest.fn(),
      update: jest.fn(),
    };

    transactionService = new TransactionService(
      mockTransactionRepository,
      mockPaymentService,
    );

    mockDeliveryRepository = {
      createDelivery: jest.fn(),
      findDeliveriesByOrderId: jest.fn(),
      findDeliveryById: jest.fn(),
      updateDelivery: jest.fn(),
    };

    orderService = new OrderService(
      mockOrderRepository,
      mockProductRepository,
      transactionService,
      mockPaymentService,
      mockCustomerRepository,
      mockDeliveryRepository,
    );
  });

  describe('createOrder', () => {
    const createOrderCommand = {
      items: [
        {
          productId: 'prod-1',
          quantity: 2,
        },
      ],
      deliveryInfo: {
        address: 'Test Address',
        city: 'Test City',
        department: 'Test Department',
        contactNumber: '1234567890',
        email: 'test@example.com',
        name: 'Test User',
      },
      paymentInfo: {
        card: {
          cardNumber: '1234567890123456',
          cardHolder: 'Test User',
          expiryMonth: '12',
          expiryYear: '23',
          cvv: '123',
        },
        installments: 1,
        customerEmail: 'test@test.co',
      },
    };

    beforeEach(() => {
      mockProductRepository.findById.mockResolvedValue({
        id: 'prod-1',
        price: new Prisma.Decimal(100),
        stock: 5,
        title: 'Test Product',
        author: 'Test Author',
        image_url: 'test.jpg',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockCustomerRepository.createCustomer.mockResolvedValue(mockCustomer);
      mockOrderRepository.create.mockResolvedValue(mockOrder);
      mockOrderRepository.update.mockResolvedValue(mockOrder);

      transactionService.processPayment = jest.fn().mockResolvedValue({
        transactionId: '1',
        status: 'ERROR',
        order: mockOrder,
      });

      mockDeliveryRepository.createDelivery.mockResolvedValue({
        id: '1',
        actualDate: new Date(),
        address: 'Test Address',
        carrier: 'Test Carrier',
        city: 'Test City',
        contactNumber: '1234567890',
        createdAt: new Date(),
        department: 'Test Department',
        estimatedDate: new Date(),
        notes: 'Test Notes',
        orderId: '1',
        recipientName: 'Test User',
        status: OrderStatus.PENDING,
        trackingNumber: '123456789',
        updatedAt: new Date(),
        order: mockOrder,
      });
    });

    it('should create an order successfully', async () => {
      const result = await orderService.createOrder(createOrderCommand);

      expect(result).toBeDefined();
      expect(result.status).toBe(OrderStatus.PENDING);
      expect(mockProductRepository.findById).toHaveBeenCalledWith('prod-1');
      expect(mockOrderRepository.create).toHaveBeenCalled();
      expect(mockOrderRepository.update).toHaveBeenCalled();
      expect(mockCustomerRepository.createCustomer).toHaveBeenCalled();
    });

    it('should throw error if product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(
        orderService.createOrder(createOrderCommand),
      ).rejects.toThrow('Product prod-1 not found');
    });

    it('should throw error if insufficient stock', async () => {
      mockProductRepository.findById.mockResolvedValue({
        id: 'prod-1',
        price: new Prisma.Decimal(100),
        stock: 1,
        title: 'Test Product',
        author: 'Test Author',
        image_url: 'test.jpg',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        orderService.createOrder(createOrderCommand),
      ).rejects.toThrow('Insufficient stock');
    });

    it('should throw an error when attempting to create an already existing customer', async () => {
      mockCustomerRepository.findCustomerByEmail.mockResolvedValue(
        mockCustomer,
      );

      await orderService.createOrder(createOrderCommand);

      expect(mockCustomerRepository.createCustomer).not.toHaveBeenCalled();
    });
  });

  describe('getOrder', () => {
    it('should return order by id', async () => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      const result = await orderService.getOrder('1');

      expect(result).toBe(mockOrder);
      expect(mockOrderRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error if order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.getOrder('1')).rejects.toThrow(
        'Order with ID 1 not found',
      );
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const mockOrders = [mockOrder];
      mockOrderRepository.findAll.mockResolvedValue(mockOrders);

      const result = await orderService.getAllOrders();

      expect(result).toBe(mockOrders);
      expect(mockOrderRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('updateOrderStatus', () => {
    const updateCommand = {
      orderId: '1',
      status: OrderStatus.PAID,
    };

    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.update.mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.PENDING,
      });
    });

    it('should update order status successfully', async () => {
      const result = await orderService.updateOrderStatus(updateCommand);

      expect(result.status).toBe(OrderStatus.PENDING);
      expect(mockOrderRepository.findById).toHaveBeenCalledWith('1');
      expect(mockOrderRepository.update).toHaveBeenCalled();
    });

    it('should throw error if order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        orderService.updateOrderStatus(updateCommand),
      ).rejects.toThrow('Order with ID 1 not found');
    });

    it('should validate status transition', async () => {
      const invalidCommand = {
        orderId: '1',
        status: OrderStatus.PENDING,
      };

      await expect(
        orderService.updateOrderStatus(invalidCommand),
      ).rejects.toThrow('Invalid status transition');
    });
  });
});
