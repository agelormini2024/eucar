/*
  Warnings:

  - Added the required column `montoPagado` to the `Recibo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Recibo" ADD COLUMN     "montoPagado" DOUBLE PRECISION NOT NULL;
