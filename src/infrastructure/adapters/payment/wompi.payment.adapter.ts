import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import axios, { Axios, AxiosError } from 'axios';
import {
  PaymentGatewayPort,
  Card,
  TokenizedCard,
  PaymentInfo,
  PaymentResult,
  RequestTokenizedCard,
  AcceptanceTokens,
  TransactionResponse,
} from 'src/shared/types/payment.type';
import { Order } from 'src/domain/entities/order.entity';

@Injectable()
export class WompiPaymentAdapter implements PaymentGatewayPort {
  private axiosIntance: Axios;
  private readonly apiUrl: string;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly integrity: string;
  constructor() {
    this.apiUrl = process.env.WOMPI_API_URL;
    this.publicKey = process.env.WOMPI_PUBLIC_KEY;
    this.privateKey = process.env.WOMPI_PRIVATE_KEY;
    this.integrity = process.env.WOMPI_INTEGRITY_KEY;

    this.axiosIntance = axios.create({
      baseURL: this.apiUrl,
    });
  }

  async processPayment(
    amount: number,
    paymentInfo: PaymentInfo,
    order: Order,
    tokenizedCard: TokenizedCard,
  ): Promise<PaymentResult> {
    try {
      // 1. Get User Authorization
      const aceptanceTokens = await this.getAcceptanceTokens();

      // 2. Get Signature
      const signature = await this.getSignature(order);

      // 3. Create transaction
      const transaction = await this.createTransaction(
        tokenizedCard,
        aceptanceTokens,
        signature,
        amount,
        order,
        paymentInfo.installments,
      );

      return {
        success: ['APPROVED', 'PENDING'].includes(transaction.status),
        transactionId: transaction.id,
        status: transaction.status,
        message: transaction.status_message,
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Payment processing failed',
      );
    }
  }

  async getTokenizedCard(card: Card): Promise<TokenizedCard> {
    const body: RequestTokenizedCard = {
      number: card.cardNumber,
      exp_month: card.expiryMonth,
      exp_year: card.expiryYear,
      cvc: card.cvv,
      card_holder: card.cardHolder,
    };

    try {
      const response = await this.axiosIntance.post<TokenizedCard>(
        '/tokens/cards',
        body,
        {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        data: response.data.data,
        status: response.data.status.toString(),
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const apiError = error.response.data?.error;
        throw new Error(
          `WOMPI_ERROR: ${apiError?.type || 'UNKNOWN_ERROR'} - ${
            JSON.stringify(apiError?.messages) || 'No additional details'
          }`,
        );
      }
      throw error;
    }
  }

  private async getAcceptanceTokens(): Promise<AcceptanceTokens> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/merchants/${this.publicKey}`,
      );
      return {
        end_user_policy:
          response.data.data.presigned_acceptance.acceptance_token,
        personal_data_auth:
          response.data.data.presigned_personal_data_auth.acceptance_token,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new HttpException(
          error.response.data.error.messages[0],
          error.response.status,
        );
      }

      throw new HttpException(
        'Failed to get acceptance tokens',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getSignature(order: Order): Promise<string> {
    const secretConcat = `${order.id}${Number(order.totalAmount) * 100}COP${this.integrity}`;
    const encondedText = new TextEncoder().encode(secretConcat);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return hashHex;
  }

  private async createTransaction(
    tokenizedCard: TokenizedCard,
    acceptanceTokens: AcceptanceTokens,
    signature: string,
    amount: number,
    order: Order,
    installments: number,
  ): Promise<any> {
    const response = await axios.post(
      `${this.apiUrl}/transactions`,
      {
        payment_method: {
          type: 'CARD',
          installments: installments,
          token: tokenizedCard.data.id,
        },
        amount_in_cents: Math.round(amount * 100),
        currency: 'COP',
        reference: order.id,
        customer_email: order.customer.email,
        acceptance_token: acceptanceTokens.end_user_policy,
        accept_personal_data: acceptanceTokens.personal_data_auth,
        signature: signature,
        redirect_url: null,
        payment_method_type: 'CARD',

        shipping_address: {
          address_line_1: order.customer.address,
          country: 'CO',
          region: order.customer.department,
          city: order.customer.city,
          phone_number: order.customer.contactNumber,
        },

        customer_data: {
          full_name: order.customer.name,
          phone_number: order.customer.contactNumber,
          legal_id: '123456789',
          legal_id_type: 'CC',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
        },
      },
    );

    return response.data.data;
  }

  async getTransaction(transactionId: string): Promise<TransactionResponse> {
    const response = await axios.get(
      `${this.apiUrl}/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
        },
      },
    );

    return response.data.data;
  }
}
