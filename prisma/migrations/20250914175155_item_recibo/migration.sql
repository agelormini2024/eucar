-- CreateTable
CREATE TABLE "public"."itemRecibo" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "reciboId" INTEGER NOT NULL,

    CONSTRAINT "itemRecibo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."itemRecibo" ADD CONSTRAINT "itemRecibo_reciboId_fkey" FOREIGN KEY ("reciboId") REFERENCES "public"."Recibo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
