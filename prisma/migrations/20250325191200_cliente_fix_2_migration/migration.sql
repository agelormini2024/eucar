/*
  Warnings:

  - You are about to drop the column `direccion` on the `Cliente` table. All the data in the column will be lost.
  - Added the required column `calle` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "direccion",
ADD COLUMN     "calle" TEXT NOT NULL,
ADD COLUMN     "departamento" TEXT,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "piso" TEXT;
