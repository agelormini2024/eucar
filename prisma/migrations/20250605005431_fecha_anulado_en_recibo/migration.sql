/*
  Warnings:

  - Added the required column `fechaAnulado` to the `Recibo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recibo" ADD COLUMN     "fechaAnulado" TIMESTAMP(3) NOT NULL;
