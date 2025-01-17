import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderService } from 'src/application/services/order.service';
import { CreateOrderDto } from './dtos/order.dto';
import { ApiKeyGuard } from 'src/shared/guards/authorization.guard';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders.' })
  @UseGuards(ApiKeyGuard)
  async getAllOrders() {
    return await this.orderService.getAllOrders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by id' })
  @ApiResponse({ status: 200, description: 'Return the order.' })
  async getOrder(@Param('id') id: string) {
    return await this.orderService.getOrder(id);
  }

  @Get(':id/continue')
  @ApiOperation({
    summary:
      'Check status from trasaction and change order status and create delivery ',
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully.',
  })
  async updateOrderStatus(@Param('id') id: string) {
    return await this.orderService.checkOrderStatus(id);
  }
}
