import {
  Transaction,
  TransactionStatus,
} from 'src/domain/entities/transaction.entity';
import { PaymentInfo } from 'src/shared/types/payment.type';
import { Order } from 'src/domain/entities/order.entity';
import { TokenizedCard } from 'src/shared/types/payment.type';

export interface ProcessPaymentCommand {
  order: Order;
  amount: number;
  paymentInfo: PaymentInfo;
  tokenizedCard: TokenizedCard;
}

export interface TransactionUseCase {
  processPayment(command: ProcessPaymentCommand): Promise<Transaction>;
  getTransactionByOrderId(orderId: string): Promise<Transaction>;
  updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus,
  ): Promise<Transaction>;
}
