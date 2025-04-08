/*
  Warnings:

  - Added the required column `antiguedad` to the `Propiedad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cochera` to the `Propiedad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metrosCubiertos` to the `Propiedad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Propiedad" ADD COLUMN     "antiguedad" INTEGER NOT NULL,
ADD COLUMN     "cochera" INTEGER NOT NULL,
ADD COLUMN     "expensas" DOUBLE PRECISION,
ADD COLUMN     "metrosCubiertos" INTEGER NOT NULL;
