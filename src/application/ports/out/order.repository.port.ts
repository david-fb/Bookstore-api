import { Order, OrderItem } from 'src/domain/entities/order.entity';
import { Prisma } from '@prisma/client';

export interface OrderRepositoryPort {
  create(order: Order, items: OrderItem[]): Promise<Order>;
  findById(id: string): Promise<Order>;
  findAll(): Promise<Order[]>;
  update(id: string, data: Prisma.OrdersUpdateInput): Promise<Order>;
  findOrderItems(orderId: string): Promise<OrderItem[]>;
}
