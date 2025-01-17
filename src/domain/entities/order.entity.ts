import { OrderStatus } from 'src/domain/enums/order-status.enum';
import { Product } from './product.entity';
import { Prisma } from '@prisma/client';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { Customer } from './customer.entity';
import { Delivery } from './delivery.entity';
import { Transaction } from './transaction.entity';

export class OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: Prisma.Decimal;
  product?: Product;
}

export class OrderBase {
  id: string;
  totalAmount: Prisma.Decimal;
  baseAmount: Prisma.Decimal;
  deliveryFee: Prisma.Decimal;
  status: OrderStatus | PrismaOrderStatus;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends OrderBase {
  items: OrderItem[];
  transaction: Transaction;
  delivery?: Delivery;
  customer: Customer;
}

export class CustomerOrder extends OrderBase {
  items: OrderItem[];
  transaction: Transaction;
  delivery: Delivery;
}
