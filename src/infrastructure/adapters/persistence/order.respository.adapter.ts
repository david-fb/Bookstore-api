import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Order, OrderItem } from 'src/domain/entities/order.entity';
import { OrderRepositoryPort } from 'src/application/ports/out/order.repository.port';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderRepositoryAdapter implements OrderRepositoryPort {
  constructor(private prisma: PrismaService) {}

  async create(order: Order, items: OrderItem[]): Promise<Order> {
    return this.prisma.orders.create({
      data: {
        totalAmount: order.totalAmount,
        status: order.status as PrismaOrderStatus,
        address: order.address,
        city: order.city,
        department: order.department,
        contactNumber: order.contactNumber,
        name: order.name,
        email: order.email,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        payment_gateway_id: order.payment_gateway_id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Order> {
    return this.prisma.orders.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.orders.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: string, order: Prisma.OrdersUpdateInput): Promise<Order> {
    return this.prisma.orders.update({
      where: { id },
      data: order,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOrderItems(orderId: string): Promise<OrderItem[]> {
    return this.prisma.orderItems.findMany({
      where: { orderId },
    });
  }
}
