/*
  Warnings:

  - Added the required column `cantidadMesesDuracion` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diaMesVencimiento` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaInicio` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaVencimiento` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoContratoId` to the `Contrato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoIndiceId` to the `Contrato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contrato" ADD COLUMN     "cantidadMesesDuracion" INTEGER NOT NULL,
ADD COLUMN     "diaMesVencimiento" INTEGER NOT NULL,
ADD COLUMN     "fechaInicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaVencimiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tipoContratoId" INTEGER NOT NULL,
ADD COLUMN     "tipoIndiceId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TipoContrato" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidadMesesActualizacion" INTEGER NOT NULL,

    CONSTRAINT "TipoContrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoIndice" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "TipoIndice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleContrato" (
    "id" SERIAL NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "indiceAplicado" DOUBLE PRECISION NOT NULL,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetalleContrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoItemRecibo" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "TipoItemRecibo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recibo" (
    "id" SERIAL NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "montoTotal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recibo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemRecibo" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "reciboId" INTEGER NOT NULL,
    "tipoItemReciboId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemRecibo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_tipoContratoId_fkey" FOREIGN KEY ("tipoContratoId") REFERENCES "TipoContrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_tipoIndiceId_fkey" FOREIGN KEY ("tipoIndiceId") REFERENCES "TipoIndice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleContrato" ADD CONSTRAINT "DetalleContrato_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recibo" ADD CONSTRAINT "Recibo_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRecibo" ADD CONSTRAINT "ItemRecibo_reciboId_fkey" FOREIGN KEY ("reciboId") REFERENCES "Recibo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRecibo" ADD CONSTRAINT "ItemRecibo_tipoItemReciboId_fkey" FOREIGN KEY ("tipoItemReciboId") REFERENCES "TipoItemRecibo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
