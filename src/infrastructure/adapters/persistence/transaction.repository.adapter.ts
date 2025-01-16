import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { TransactionRepositoryPort } from 'src/application/ports/out/transaction.repository.port';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionRepositoryAdapter implements TransactionRepositoryPort {
  constructor(private prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        orderId: transaction.orderId,
        amount: new Prisma.Decimal(transaction.amount),
        gatewayTransactionId: transaction.gatewayTransactionId,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        lastFourDigits: transaction.lastFourDigits,
        gatewayResponse: transaction.gatewayResponse,
        errorMessage: transaction.errorMessage,
      },
    });
  }

  async findById(id: string): Promise<Transaction> {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  async findByOrderId(orderId: string): Promise<Transaction> {
    return this.prisma.transaction.findUnique({
      where: { orderId },
    });
  }

  async update(
    id: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: transaction,
    });
  }
}
