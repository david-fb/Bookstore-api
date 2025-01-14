import { Prisma } from '@prisma/client';

export class Product {
  id: string;
  title: string;
  author: string;
  description: string;
  price: Prisma.Decimal;
  stock: number;
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
}
