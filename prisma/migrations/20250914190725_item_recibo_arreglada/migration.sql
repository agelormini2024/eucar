/*
  Warnings:

  - You are about to drop the `itemRecibo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."itemRecibo" DROP CONSTRAINT "itemRecibo_reciboId_fkey";

-- DropTable
DROP TABLE "public"."itemRecibo";

-- CreateTable
CREATE TABLE "public"."ItemRecibo" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "reciboId" INTEGER NOT NULL,

    CONSTRAINT "ItemRecibo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ItemRecibo" ADD CONSTRAINT "ItemRecibo_reciboId_fkey" FOREIGN KEY ("reciboId") REFERENCES "public"."Recibo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
