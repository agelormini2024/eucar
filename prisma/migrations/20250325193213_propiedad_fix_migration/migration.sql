/*
  Warnings:

  - You are about to drop the column `direccion` on the `Propiedad` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Propiedad` table. All the data in the column will be lost.
  - Added the required column `calle` to the `Propiedad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcion` to the `Propiedad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Propiedad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Propiedad" DROP COLUMN "direccion",
DROP COLUMN "nombre",
ADD COLUMN     "calle" TEXT NOT NULL,
ADD COLUMN     "departamento" TEXT,
ADD COLUMN     "descripcion" TEXT NOT NULL,
ADD COLUMN     "imagen" TEXT,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "piso" TEXT;
