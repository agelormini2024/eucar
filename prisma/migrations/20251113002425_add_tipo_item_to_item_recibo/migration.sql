/*
  Warnings:

  - Added the required column `tipoItemId` to the `ItemRecibo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ItemRecibo" DROP CONSTRAINT "ItemRecibo_reciboId_fkey";

-- AlterTable
ALTER TABLE "public"."ItemRecibo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "tipoItemId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."PasswordResetToken" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TipoItem" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "esModificable" BOOLEAN NOT NULL DEFAULT true,
    "esEliminable" BOOLEAN NOT NULL DEFAULT true,
    "permiteNegativo" BOOLEAN NOT NULL DEFAULT false,
    "esObligatorio" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT DEFAULT '#6B7280',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "public"."PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_idx" ON "public"."PasswordResetToken"("email");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "public"."PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "TipoItem_codigo_key" ON "public"."TipoItem"("codigo");

-- CreateIndex
CREATE INDEX "TipoItem_codigo_idx" ON "public"."TipoItem"("codigo");

-- CreateIndex
CREATE INDEX "TipoItem_activo_idx" ON "public"."TipoItem"("activo");

-- CreateIndex
CREATE INDEX "ItemRecibo_reciboId_idx" ON "public"."ItemRecibo"("reciboId");

-- CreateIndex
CREATE INDEX "ItemRecibo_tipoItemId_idx" ON "public"."ItemRecibo"("tipoItemId");

-- AddForeignKey
ALTER TABLE "public"."PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_email_fkey" FOREIGN KEY ("email") REFERENCES "public"."Usuario"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemRecibo" ADD CONSTRAINT "ItemRecibo_reciboId_fkey" FOREIGN KEY ("reciboId") REFERENCES "public"."Recibo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemRecibo" ADD CONSTRAINT "ItemRecibo_tipoItemId_fkey" FOREIGN KEY ("tipoItemId") REFERENCES "public"."TipoItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
