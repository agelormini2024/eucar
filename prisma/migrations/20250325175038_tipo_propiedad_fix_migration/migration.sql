/*
  Warnings:

  - You are about to drop the column `categoriaPropiedadId` on the `Propiedad` table. All the data in the column will be lost.
  - You are about to drop the `CategoriaPropiedad` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tipoPropiedadId` to the `Propiedad` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Propiedad" DROP CONSTRAINT "Propiedad_categoriaPropiedadId_fkey";

-- AlterTable
ALTER TABLE "Propiedad" DROP COLUMN "categoriaPropiedadId",
ADD COLUMN     "tipoPropiedadId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CategoriaPropiedad";

-- CreateTable
CREATE TABLE "TipoPropiedad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoPropiedad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Propiedad" ADD CONSTRAINT "Propiedad_tipoPropiedadId_fkey" FOREIGN KEY ("tipoPropiedadId") REFERENCES "TipoPropiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
