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
  getTransaction(transactionId: string): Promise<TransactionResponse>;
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

export interface TransactionResponse {
  id: string;
  created_at: string;
  finalized_at: string;
  amount_in_cents: number;
  reference: string;
  currency: string;
  payment_method_type: string;
  payment_method: {
    type: string;
    extra: {
      name: string;
      brand: string;
      card_type: string;
      last_four: string;
      is_three_ds: boolean;
      three_ds_auth: {
        three_ds_auth: {
          current_step: string;
          current_step_status: string;
        };
      };
      three_ds_auth_type: string;
      external_identifier: string;
      processor_response_code: string;
    };
    installments: number;
  };
  payment_link_id: string;
  redirect_url: string;
  status: string;
  status_message: string;
  merchant: {
    id: number;
    name: string;
    legal_name: string;
    contact_name: string;
    phone_number: string;
    logo_url: string;
    legal_id_type: string;
    email: string;
    legal_id: string;
    public_key: string;
  };
  taxes: [];
  tip_in_cents: number;
}
