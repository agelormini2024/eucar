/*
  Warnings:

  - Added the required column `descripcion` to the `Contrato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contrato" ADD COLUMN     "descripcion" TEXT NOT NULL;
