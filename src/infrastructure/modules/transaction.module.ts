import { Module } from '@nestjs/common';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionService } from 'src/application/services/transaction.service';
import { TransactionRepositoryAdapter } from '../adapters/persistence/transaction.repository.adapter';
import { PrismaModule } from '../adapters/persistence/prisma/prisma.module';
import { WompiPaymentAdapter } from '../adapters/payment/wompi.payment.adapter';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: 'TransactionRepository',
      useClass: TransactionRepositoryAdapter,
    },
    {
      provide: 'PaymentGateway',
      useClass: WompiPaymentAdapter,
    },
  ],
  exports: [TransactionService],
})
export class TransactionModule {}
