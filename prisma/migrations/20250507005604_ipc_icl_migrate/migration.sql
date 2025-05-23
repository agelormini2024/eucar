-- CreateTable
CREATE TABLE "Ipc" (
    "id" SERIAL NOT NULL,
    "annoMes" TEXT NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Ipc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Icl" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "indice" DOUBLE PRECISION NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Icl_pkey" PRIMARY KEY ("id")
);
