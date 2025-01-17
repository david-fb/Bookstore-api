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
        baseAmount: order.baseAmount,
        deliveryFee: order.deliveryFee,
        status: order.status as PrismaOrderStatus,
        customer: {
          connect: {
            id: order.customerId,
          },
        },
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
        transaction: true,
        delivery: {
          include: {
            order: true,
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
        customer: true,
        transaction: true,
        delivery: {
          include: {
            order: true,
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
        customer: true,
        transaction: true,
        delivery: {
          include: {
            order: true,
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
        customer: true,
        transaction: true,
        delivery: {
          include: {
            order: true,
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
