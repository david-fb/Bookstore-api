import { Customer } from '@prisma/client';
import { Prisma } from '@prisma/client';

export interface CustomerRepositoryPort {
  createCustomer(
    customer: Prisma.CustomerCreateWithoutOrdersInput,
  ): Promise<Customer>;
  findCustomerById(customerId: string): Promise<Customer>;
  findCustomerByEmail(email: string): Promise<Customer>;
  updateCustomer(customer: Customer): Promise<Customer>;
}
