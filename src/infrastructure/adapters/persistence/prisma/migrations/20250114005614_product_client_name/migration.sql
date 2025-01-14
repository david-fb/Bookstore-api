/*
  Warnings:

  - Added the required column `email` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "image_url" TEXT NOT NULL;
