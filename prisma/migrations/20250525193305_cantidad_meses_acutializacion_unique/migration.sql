/*
  Warnings:

  - A unique constraint covering the columns `[cantidadMesesActualizacion]` on the table `TipoContrato` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TipoContrato_cantidadMesesActualizacion_key" ON "TipoContrato"("cantidadMesesActualizacion");
