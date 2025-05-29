"use server"
import { prisma } from "@/src/lib/prisma"

export async function getTipoContrato() {
    const tipoContrato = prisma.tipoContrato.findMany({
        orderBy: {cantidadMesesActualizacion: 'asc'}
    })  
    return tipoContrato  
}