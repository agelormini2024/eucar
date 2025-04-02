/*
  Warnings:

  - A unique constraint covering the columns `[cuit]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cuit_key" ON "Cliente"("cuit");
