import { DeliveryStatus } from '@prisma/client';
import { Order } from './order.entity';

export class Delivery {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  trackingNumber: string;
  carrier: string;
  address: string;
  city: string;
  department: string;
  contactNumber: string;
  recipientName: string;
  estimatedDate: Date;
  actualDate: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  order?: Partial<Order>;
}
