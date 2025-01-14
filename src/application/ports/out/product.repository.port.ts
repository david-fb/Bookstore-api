import { Product } from 'src/domain/entities/product.entity';

export interface ProductRepositoryPort {
  create(product: Product): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  findById(id: string): Promise<Product>;
  findAll(): Promise<Product[]>;
  delete(id: string): Promise<void>;
}
