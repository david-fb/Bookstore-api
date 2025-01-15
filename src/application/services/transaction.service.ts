import { Injectable, Inject } from '@nestjs/common';
import {
  TransactionUseCase,
  ProcessPaymentCommand,
} from '../ports/in/transaction.use-case';
import { TransactionRepositoryPort } from '../ports/out/transaction.repository.port';
import { PaymentGatewayPort } from 'src/shared/types/payment.type';
import {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService implements TransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepositoryPort,
    @Inject('PaymentGateway')
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async processPayment(command: ProcessPaymentCommand): Promise<Transaction> {
    let transaction = new Transaction();
    transaction.orderId = command.order.id;
    transaction.amount = new Prisma.Decimal(command.amount);
    transaction.status = TransactionStatus.PENDING;
    transaction.paymentMethod = 'CARD';
    transaction.lastFourDigits = command.tokenizedCard.data.last_four;

    transaction = await this.transactionRepository.create(transaction);
    try {
      // Process payment with Wompi
      const paymentResult = await this.paymentGateway.processPayment(
        command.amount,
        command.paymentInfo,
        command.order,
        command.tokenizedCard,
      );

      // Update transaction with gateway response
      const updateData: Partial<Transaction> = {
        gatewayTransactionId: paymentResult.transactionId,
        gatewayResponse: paymentResult,
        status: this.getStatusFromPaymentResult(paymentResult),
        errorMessage: paymentResult.success ? null : paymentResult.message,
      };

      return await this.transactionRepository.update(
        transaction.id,
        updateData,
      );
    } catch (error) {
      const updateData: Partial<Transaction> = {
        status: TransactionStatus.ERROR,
        errorMessage: error.message,
      };

      return await this.transactionRepository.update(
        transaction.id,
        updateData,
      );
    }
  }

  async getTransactionByOrderId(orderId: string): Promise<Transaction> {
    return await this.transactionRepository.findByOrderId(orderId);
  }

  async updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus,
  ): Promise<Transaction> {
    return await this.transactionRepository.update(transactionId, { status });
  }

  getStatusFromPaymentResult(paymentResult: any): TransactionStatus {
    switch (paymentResult.status) {
      case 'PENDING':
        return TransactionStatus.PENDING;
      case 'APPROVED':
        return TransactionStatus.APPROVED;
      case 'DECLINED':
        return TransactionStatus.DECLINED;
      case 'VOIDED':
        return TransactionStatus.VOIDED;
      default:
        return TransactionStatus.ERROR;
    }
  }
}
