import { Order } from 'src/domain/entities/order.entity';
import { OrderStatus } from 'src/domain/enums/order-status.enum';

export interface CreateOrderCommand {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  deliveryInfo: {
    address: string;
    city: string;
    department: string;
    contactNumber: string;
    email: string;
    name: string;
  };
  //   paymentInfo: PaymentInfo;
  paymentInfo: any;
}

export interface UpdateOrderStatusCommand {
  orderId: string;
  status: OrderStatus;
}

export interface OrderUseCase {
  createOrder(command: CreateOrderCommand): Promise<Order>;
  getOrder(id: string): Promise<Order>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(command: UpdateOrderStatusCommand): Promise<Order>;
}
