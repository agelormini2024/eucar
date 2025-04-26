/*
  Warnings:

  - You are about to drop the column `rolClienteId` on the `Contrato` table. All the data in the column will be lost.
  - You are about to drop the `RolCliente` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contrato" DROP CONSTRAINT "Contrato_rolClienteId_fkey";

-- AlterTable
ALTER TABLE "Contrato" DROP COLUMN "rolClienteId";

-- DropTable
DROP TABLE "RolCliente";
