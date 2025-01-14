import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Product } from 'src/domain/entities/product.entity';
import {
  ProductUseCase,
  CreateProductCommand,
  UpdateProductCommand,
} from '../ports/in/product.use-case';
import { ProductRepositoryPort } from '../ports/out/product.repository.port';

@Injectable()
export class ProductService implements ProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async createProduct(command: CreateProductCommand): Promise<Product> {
    const product = new Product();
    product.title = command.title;
    product.author = command.author;
    product.description = command.description;
    product.price = command.price;
    product.stock = command.stock;
    product.image_url = command.image_url;

    return await this.productRepository.create(product);
  }

  async updateProduct(command: UpdateProductCommand): Promise<Product> {
    const product = await this.productRepository.findById(command.id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${command.id} not found`);
    }

    return await this.productRepository.update(command.id, command);
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.productRepository.delete(id);
  }
}
