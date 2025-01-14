import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'The Great Gatsby' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald' })
  @IsString()
  author: string;

  @ApiProperty({ example: 'A novel about the American Dream' })
  @IsString()
  description: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @Min(0)
  price: Prisma.Decimal;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  image_url: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'The Great Gatsby' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'F. Scott Fitzgerald' })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({ example: 'A novel about the American Dream' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 999.99 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: Prisma.Decimal;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  image_url?: string;
}
