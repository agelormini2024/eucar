/*
  Warnings:

  - You are about to drop the column `fecha` on the `Recibo` table. All the data in the column will be lost.
  - Added the required column `fechaGenerado` to the `Recibo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaImpreso` to the `Recibo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaPendiente` to the `Recibo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recibo" DROP COLUMN "fecha",
ADD COLUMN     "fechaGenerado" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaImpreso" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaPendiente" TIMESTAMP(3) NOT NULL;
