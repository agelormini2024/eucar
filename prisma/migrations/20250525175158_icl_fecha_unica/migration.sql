/*
  Warnings:

  - A unique constraint covering the columns `[fecha]` on the table `Icl` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Icl_fecha_key" ON "Icl"("fecha");
