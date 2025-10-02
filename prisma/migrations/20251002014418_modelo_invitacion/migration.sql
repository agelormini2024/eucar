/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "rol" TEXT NOT NULL DEFAULT 'usuario';

-- CreateTable
CREATE TABLE "public"."Invitacion" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "creadoPor" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "usadoAt" TIMESTAMP(3),

    CONSTRAINT "Invitacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitacion_email_key" ON "public"."Invitacion"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Invitacion_codigo_key" ON "public"."Invitacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."Invitacion" ADD CONSTRAINT "Invitacion_creadoPor_fkey" FOREIGN KEY ("creadoPor") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
