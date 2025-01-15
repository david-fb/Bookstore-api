import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './infrastructure/modules/product.module';
import { PrismaModule } from './infrastructure/adapters/persistence/prisma/prisma.module';
import { ApiKeyGuard } from './shared/guards/authorization.guard';
import { OrderModule } from './infrastructure/modules/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ProductModule,
    OrderModule,
  ],
  providers: [ApiKeyGuard],
})
export class AppModule {}
