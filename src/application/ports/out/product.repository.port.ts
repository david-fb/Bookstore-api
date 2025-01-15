import { Product } from 'src/domain/entities/product.entity';
import { Prisma } from '@prisma/client';

export interface ProductRepositoryPort {
  create(product: Product): Promise<Product>;
  update(id: string, data: Prisma.ProductsUpdateInput): Promise<Product>;
  findById(id: string): Promise<Product>;
  findAll(): Promise<Product[]>;
  delete(id: string): Promise<void>;
}
