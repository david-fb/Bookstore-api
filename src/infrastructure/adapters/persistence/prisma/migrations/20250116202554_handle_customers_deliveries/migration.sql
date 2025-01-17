/*
  Warnings:

  - You are about to drop the column `address` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `contactNumber` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `payment_gateway_id` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `baseAmount` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryFee` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED');

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "contactNumber",
DROP COLUMN "department",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "payment_gateway_id",
ADD COLUMN     "baseAmount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "deliveryFee" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactNumber" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "estimatedDate" TIMESTAMP(3),
    "actualDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_orderId_key" ON "Delivery"("orderId");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
