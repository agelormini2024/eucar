/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Contrato` table. All the data in the column will be lost.
  - Added the required column `clienteIdInquilino` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteIdPropietario` to the `Contrato` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contrato" DROP CONSTRAINT "Contrato_clienteId_fkey";

-- AlterTable
ALTER TABLE "Contrato" DROP COLUMN "clienteId",
ADD COLUMN     "clienteIdInquilino" INTEGER NOT NULL,
ADD COLUMN     "clienteIdPropietario" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_clienteIdPropietario_fkey" FOREIGN KEY ("clienteIdPropietario") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_clienteIdInquilino_fkey" FOREIGN KEY ("clienteIdInquilino") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
