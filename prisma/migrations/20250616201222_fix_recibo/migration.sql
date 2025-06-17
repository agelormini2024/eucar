-- AlterTable
ALTER TABLE "Recibo" ALTER COLUMN "fechaGenerado" DROP NOT NULL,
ALTER COLUMN "fechaImpreso" DROP NOT NULL,
ALTER COLUMN "fechaAnulado" DROP NOT NULL;
