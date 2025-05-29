/*
  Warnings:

  - You are about to drop the column `porcentaje` on the `Icl` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[annoMes]` on the table `Ipc` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Icl" DROP COLUMN "porcentaje";

-- CreateIndex
CREATE UNIQUE INDEX "Ipc_annoMes_key" ON "Ipc"("annoMes");
