import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/domain/enums/order-status.enum';

export class OrderItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class DeliveryInfoDto {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  department: string;

  @ApiProperty()
  @IsString()
  contactNumber: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}

export class CardDto {
  @ApiProperty()
  @IsString()
  cardNumber: string;

  @ApiProperty()
  @IsString()
  expiryMonth: string;

  @ApiProperty()
  @IsString()
  expiryYear: string;

  @ApiProperty()
  @IsString()
  cvv: string;

  @ApiProperty()
  @IsString()
  cardHolder: string;
}

export class PaymentInfoDto {
  @ApiProperty({ type: CardDto })
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;

  @ApiProperty()
  @IsString()
  customerEmail: string;

  @ApiProperty()
  @IsNumber()
  installments: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: DeliveryInfoDto })
  @ValidateNested()
  @Type(() => DeliveryInfoDto)
  deliveryInfo: DeliveryInfoDto;

  @ApiProperty({ type: PaymentInfoDto })
  @ValidateNested()
  @Type(() => PaymentInfoDto)
  paymentInfo: PaymentInfoDto;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
