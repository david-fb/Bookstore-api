import { Transaction } from '../../../domain/entities/transaction.entity';

export interface TransactionRepositoryPort {
  create(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction>;
  findByOrderId(orderId: string): Promise<Transaction>;
  update(id: string, transaction: Partial<Transaction>): Promise<Transaction>;
}
