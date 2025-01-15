import { Module } from '@nestjs/common';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from 'src/application/services/order.service';
import { OrderRepositoryAdapter } from '../adapters/persistence/order.respository.adapter';
import { PrismaModule } from '../adapters/persistence/prisma/prisma.module';
import { ProductRepositoryAdapter } from '../adapters/persistence/product.repository.adapter';

@Module({
  imports: [PrismaModule],
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
  ],
  exports: [OrderService],
})
export class OrderModule {}
