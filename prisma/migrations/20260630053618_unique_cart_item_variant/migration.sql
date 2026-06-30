/*
  Warnings:

  - You are about to drop the column `guestId` on the `CartItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,productId,variantId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CartItem_guestId_idx";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "guestId";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_productId_variantId_key" ON "CartItem"("userId", "productId", "variantId");
