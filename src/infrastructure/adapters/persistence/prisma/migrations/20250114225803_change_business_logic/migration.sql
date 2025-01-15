/*
  Warnings:

  - You are about to drop the `Transactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `payment_gateway_id` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_orderId_fkey";

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "payment_gateway_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Transactions";
