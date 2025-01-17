import { CustomerOrder } from './order.entity';

export class Customer {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  isRegistered: boolean;
  orders?: CustomerOrder[]; // Usa CustomerOrder en lugar de Order
}
