/*
  Warnings:

  - Added the required column `clienteId` to the `Propiedad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Propiedad" ADD COLUMN     "clienteId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Propiedad" ADD CONSTRAINT "Propiedad_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
