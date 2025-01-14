import { Module } from '@nestjs/common';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../../application/services/product.service';
import { ProductRepositoryAdapter } from '../adapters/persistence/product.repository.adapter';
import { PrismaModule } from '../adapters/persistence/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryAdapter,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
