/*
  Warnings:

  - Changed the type of `numero` on the `Cliente` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "numero",
ADD COLUMN     "numero" INTEGER NOT NULL;
