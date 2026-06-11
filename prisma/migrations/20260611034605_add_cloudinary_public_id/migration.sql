-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "publicId" TEXT;

-- CreateIndex
CREATE INDEX "ProductImage_publicId_idx" ON "ProductImage"("publicId");
