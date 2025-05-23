/*
  Warnings:

  - Added the required column `otros` to the `Recibo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItemRecibo" DROP CONSTRAINT "ItemRecibo_tipoIndiceId_fkey";

-- AlterTable
ALTER TABLE "Contrato" ADD COLUMN     "montoAlquilerUltimo" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ItemRecibo" ALTER COLUMN "indiceAplicado" DROP NOT NULL,
ALTER COLUMN "tipoIndiceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Recibo" ADD COLUMN     "otros" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "ItemRecibo" ADD CONSTRAINT "ItemRecibo_tipoIndiceId_fkey" FOREIGN KEY ("tipoIndiceId") REFERENCES "TipoIndice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
