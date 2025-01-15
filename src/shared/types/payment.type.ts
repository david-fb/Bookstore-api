import { Order } from 'src/domain/entities/order.entity';

export interface Card {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolder: string;
}

export interface PaymentInfo {
  card: Card;
  customerEmail: string;
  installments: number;
}

export interface TokenizedCard {
  status: string;
  data: {
    id: string;
    created_at: string;
    brand: string;
    name: string;
    last_four: string;
    bin: string;
    exp_year: string;
    exp_month: string;
    card_holder: string;
    created_with_cvc: boolean;
    expires_at: string;
    validity_ends_at: string;
  };
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: string;
  message?: string;
}

export interface PaymentGatewayPort {
  processPayment(
    amount: number,
    paymentInfo: PaymentInfo,
    order: Order,
    tokenizedCard: TokenizedCard,
  ): Promise<PaymentResult>;
  getTokenizedCard(card: Card): Promise<TokenizedCard>;
}

export interface RequestTokenizedCard {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  card_holder: string;
}

export interface AcceptanceTokens {
  end_user_policy: string;
  personal_data_auth: string;
}
