"use server"

import { prisma } from "@/src/lib/prisma"
import { ContratoSchema } from "@/src/schema"

export async function updateContrato(data: unknown, id: number){
    
    const result = ContratoSchema.safeParse(data) // Validar (del lado del servidor) los datos con el esquema de Contrato de Zod

    if(!result.success){
        return {
            errors: result.error.issues
        }
    }
    // Convertir las fechas a objetos Date

const { fechaInicio, fechaVencimiento, ...rest } = result.data
const contratoData = {
    ...rest,
    fechaInicio: new Date(fechaInicio),
    fechaVencimiento: new Date(fechaVencimiento)
}

    await prisma.contrato.update({
        where: {
            id
        },
        data: contratoData
    })

}