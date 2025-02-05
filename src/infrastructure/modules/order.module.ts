import { Module } from '@nestjs/common';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from 'src/application/services/order.service';
import { OrderRepositoryAdapter } from '../adapters/persistence/order.respository.adapter';
import { PrismaModule } from '../adapters/persistence/prisma/prisma.module';
import { ProductRepositoryAdapter } from '../adapters/persistence/product.repository.adapter';
import { TransactionModule } from './transaction.module';
import { WompiPaymentAdapter } from '../adapters/payment/wompi.payment.adapter';
import { CustomerRepositoryAdapter } from '../adapters/persistence/customer.repository.adapter';
import { DeliveryRepositoryAdapter } from '../adapters/persistence/delivery.repository.adapter';

@Module({
  imports: [PrismaModule, TransactionModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: 'OrderRepository',
      useClass: OrderRepositoryAdapter,
    },
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryAdapter,
    },
    {
      provide: 'PaymentGateway',
      useClass: WompiPaymentAdapter,
    },
    {
      provide: 'CustomerRepository',
      useClass: CustomerRepositoryAdapter,
    },
    {
      provide: 'DeliveryRepository',
      useClass: DeliveryRepositoryAdapter,
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
