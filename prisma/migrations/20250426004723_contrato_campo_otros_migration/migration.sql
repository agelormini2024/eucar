/*
  Warnings:

  - Added the required column `otros` to the `Contrato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contrato" ADD COLUMN     "otros" BOOLEAN NOT NULL;
