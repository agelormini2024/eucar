/*
  Warnings:

  - Added the required column `montoAnterior` to the `Recibo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recibo" ADD COLUMN     "montoAnterior" DOUBLE PRECISION NOT NULL;
