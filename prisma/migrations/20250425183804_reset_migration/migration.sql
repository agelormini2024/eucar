/*
  Warnings:

  - You are about to drop the `DetalleContrato` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `abl` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aysa` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expensas` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gas` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `luz` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoAlquilerInicial` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indiceAplicado` to the `ItemRecibo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoIndiceId` to the `ItemRecibo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abl` to the `Recibo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aysa` to the `Recibo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expensas` to the `Recibo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gas` to the `Recibo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `luz` to the `Recibo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DetalleContrato" DROP CONSTRAINT "DetalleContrato_contratoId_fkey";

-- AlterTable
ALTER TABLE "Contrato" ADD COLUMN     "abl" BOOLEAN NOT NULL,
ADD COLUMN     "aysa" BOOLEAN NOT NULL,
ADD COLUMN     "expensas" BOOLEAN NOT NULL,
ADD COLUMN     "gas" BOOLEAN NOT NULL,
ADD COLUMN     "luz" BOOLEAN NOT NULL,
ADD COLUMN     "montoAlquilerInicial" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ItemRecibo" ADD COLUMN     "indiceAplicado" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tipoIndiceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Recibo" ADD COLUMN     "abl" BOOLEAN NOT NULL,
ADD COLUMN     "aysa" BOOLEAN NOT NULL,
ADD COLUMN     "expensas" BOOLEAN NOT NULL,
ADD COLUMN     "gas" BOOLEAN NOT NULL,
ADD COLUMN     "luz" BOOLEAN NOT NULL,
ADD COLUMN     "observaciones" TEXT;

-- DropTable
DROP TABLE "DetalleContrato";

-- AddForeignKey
ALTER TABLE "ItemRecibo" ADD CONSTRAINT "ItemRecibo_tipoIndiceId_fkey" FOREIGN KEY ("tipoIndiceId") REFERENCES "TipoIndice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
