import { Delivery } from 'src/domain/entities/delivery.entity';

export interface DeliveryRepositoryPort {
  createDelivery(delivery: Delivery): Promise<Delivery>;
  findDeliveryById(deliveryId: string): Promise<Delivery>;
  findDeliveriesByOrderId(orderId: string): Promise<Delivery[]>;
  updateDelivery(delivery: Delivery): Promise<Delivery>;
}
