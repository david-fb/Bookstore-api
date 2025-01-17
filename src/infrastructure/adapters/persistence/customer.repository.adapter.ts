import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Customer } from 'src/domain/entities/customer.entity';
import { CustomerRepositoryPort } from 'src/application/ports/out/customer.respository.port';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerRepositoryAdapter implements CustomerRepositoryPort {
  constructor(private prisma: PrismaService) {}

  async createCustomer(
    customer: Prisma.CustomerCreateWithoutOrdersInput,
  ): Promise<Customer> {
    return this.prisma.customer.create({
      data: {
        name: customer.name,
        email: customer.email,
        contactNumber: customer.contactNumber,
        address: customer.address,
        city: customer.city,
        department: customer.department,
        password: customer.password,
        isRegistered: customer.isRegistered,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      },
    });
  }

  async findCustomerById(customerId: string): Promise<Customer> {
    return this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          include: {
            items: true,
            transaction: true,
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

  async findCustomerByEmail(email: string): Promise<Customer> {
    return this.prisma.customer.findUnique({
      where: { email },
      include: {
        orders: {
          include: {
            items: true,
            transaction: true,
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

  async updateCustomer(customer: Customer): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        name: customer.name,
        email: customer.email,
        contactNumber: customer.contactNumber,
        address: customer.address,
        city: customer.city,
        department: customer.department,
        password: customer.password,
        isRegistered: customer.isRegistered,
        updatedAt: customer.updatedAt,
      },
    });
  }
}
