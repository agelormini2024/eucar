/*
  Warnings:

  - You are about to drop the column `nombre` on the `TipoPropiedad` table. All the data in the column will be lost.
  - Added the required column `name` to the `TipoIndice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcion` to the `TipoPropiedad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TipoIndice" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TipoPropiedad" DROP COLUMN "nombre",
ADD COLUMN     "descripcion" TEXT NOT NULL;
