/*
  Warnings:

  - Added the required column `mesesRestaActualizar` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estadoReciboId` to the `Recibo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contrato" ADD COLUMN     "mesesRestaActualizar" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Recibo" ADD COLUMN     "estadoReciboId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "EstadoRecibo" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "EstadoRecibo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recibo" ADD CONSTRAINT "Recibo_estadoReciboId_fkey" FOREIGN KEY ("estadoReciboId") REFERENCES "EstadoRecibo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
