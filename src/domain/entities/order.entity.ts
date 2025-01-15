import { OrderStatus } from 'src/domain/enums/order-status.enum';
import { Product } from './product.entity';
import { Prisma } from '@prisma/client';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';

export class OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: Prisma.Decimal;
  product?: Product;
}

export class Order {
  id: string;
  totalAmount: Prisma.Decimal;
  status: OrderStatus | PrismaOrderStatus;
  address: string;
  city: string;
  department: string;
  contactNumber: string;
  name: string;
  email: string;
  items: OrderItem[];
  payment_gateway_id?: string;
  createdAt: Date;
  updatedAt: Date;
}
