import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Product } from 'src/domain/entities/product.entity';
import { ProductRepositoryPort } from 'src/application/ports/out/product.repository.port';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  constructor(private prisma: PrismaService) {}

  async create(product: Product): Promise<Product> {
    return this.prisma.products.create({
      data: {
        title: product.title,
        author: product.author,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image_url: product.image_url,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(
    id: string,
    product: Prisma.ProductsUpdateInput,
  ): Promise<Product> {
    return this.prisma.products.update({
      where: { id },
      data: product,
    });
  }

  async findById(id: string): Promise<Product> {
    return this.prisma.products.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.products.findMany();
  }

  async delete(id: string): Promise<void> {
    await this.prisma.products.delete({
      where: { id },
    });
  }
}
