import { Prisma } from '@prisma/client';
import { TransactionStatus as TransactionStatusPrisma } from '@prisma/client';

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  VOIDED = 'VOIDED',
  ERROR = 'ERROR',
}

export class Transaction {
  id: string;
  orderId: string;
  amount: Prisma.Decimal;
  gatewayTransactionId: string;
  status: TransactionStatus | TransactionStatusPrisma;
  paymentMethod: string;
  lastFourDigits?: string;
  gatewayResponse?: any;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
