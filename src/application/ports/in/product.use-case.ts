import { Product } from 'src/domain/entities/product.entity';
import { Prisma } from '@prisma/client';

export interface CreateProductCommand {
  title: string;
  author: string;
  description: string;
  price: Prisma.Decimal;
  stock: number;
  image_url: string;
}

export interface UpdateProductCommand {
  id: string;
  title?: string;
  author?: string;
  description?: string;
  price?: Prisma.Decimal;
  stock?: number;
  image_url?: string;
}

export interface ProductUseCase {
  createProduct(command: CreateProductCommand): Promise<Product>;
  updateProduct(command: UpdateProductCommand): Promise<Product>;
  getProduct(id: string): Promise<Product>;
  getAllProducts(): Promise<Product[]>;
  deleteProduct(id: string): Promise<void>;
}
