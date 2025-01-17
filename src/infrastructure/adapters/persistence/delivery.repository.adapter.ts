import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Delivery } from 'src/domain/entities/delivery.entity';
import { DeliveryRepositoryPort } from 'src/application/ports/out/delivery.repository.port';

@Injectable()
export class DeliveryRepositoryAdapter implements DeliveryRepositoryPort {
  constructor(private prisma: PrismaService) {}

  async createDelivery(delivery: Delivery): Promise<Delivery> {
    return this.prisma.delivery.create({
      data: {
        orderId: delivery.orderId,
        status: delivery.status,
        trackingNumber: delivery.trackingNumber,
        carrier: delivery.carrier,
        address: delivery.address,
        city: delivery.city,
        department: delivery.department,
        contactNumber: delivery.contactNumber,
        recipientName: delivery.recipientName,
        estimatedDate: delivery.estimatedDate,
        actualDate: delivery.actualDate,
        notes: delivery.notes,
        createdAt: delivery.createdAt,
        updatedAt: delivery.updatedAt,
      },
      include: {
        order: {
          include: {
            items: true,
            transaction: true,
            customer: true,
            delivery: {
              include: {
                order: true,
              },
            },
          },
        },
      },
    });
  }

  async findDeliveryById(deliveryId: string): Promise<Delivery> {
    return this.prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        order: {
          include: {
            items: false,
            transaction: false,
            delivery: {
              include: {
                order: true,
              },
            },
          },
        },
      },
    });
  }

  async findDeliveriesByOrderId(orderId: string): Promise<Delivery[]> {
    return this.prisma.delivery.findMany({
      where: { orderId },
      include: {
        order: {
          include: {
            items: false,
            transaction: false,
            delivery: {
              include: {
                order: true,
              },
            },
          },
        },
      },
    });
  }

  async updateDelivery(delivery: Delivery): Promise<Delivery> {
    return this.prisma.delivery.update({
      where: { id: delivery.id },
      data: {
        orderId: delivery.orderId,
        status: delivery.status,
        trackingNumber: delivery.trackingNumber,
        carrier: delivery.carrier,
        address: delivery.address,
        city: delivery.city,
        department: delivery.department,
        contactNumber: delivery.contactNumber,
        recipientName: delivery.recipientName,
        estimatedDate: delivery.estimatedDate,
        actualDate: delivery.actualDate,
        notes: delivery.notes,
        createdAt: delivery.createdAt,
        updatedAt: delivery.updatedAt,
      },
      include: {
        order: {
          include: {
            items: false,
            transaction: false,
            delivery: {
              include: {
                order: true,
              },
            },
          },
        },
      },
    });
  }
}
