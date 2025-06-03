/*
  Warnings:

  - You are about to drop the `ItemRecibo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemRecibo" DROP CONSTRAINT "ItemRecibo_reciboId_fkey";

-- DropForeignKey
ALTER TABLE "ItemRecibo" DROP CONSTRAINT "ItemRecibo_tipoIndiceId_fkey";

-- DropForeignKey
ALTER TABLE "ItemRecibo" DROP CONSTRAINT "ItemRecibo_tipoItemReciboId_fkey";

-- DropTable
DROP TABLE "ItemRecibo";
