import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionService } from '../../application/services/transaction.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get transaction by order ID' })
  @ApiResponse({ status: 200, description: 'Return the transaction.' })
  async getTransactionByOrderId(@Param('orderId') orderId: string) {
    return await this.transactionService.getTransactionByOrderId(orderId);
  }

  @Get('order/:orderId/status')
  @ApiOperation({ summary: 'Check transaction status and updated if needed' })
  @ApiResponse({ status: 200, description: 'Return the order.' })
  async checkTransactionStatus(@Param('orderId') orderId: string) {
    return await this.transactionService.checkTransactionStatus(orderId);
  }
}
