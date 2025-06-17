"use server"
import { prisma } from "@/src/lib/prisma";
import { ReciboSchema } from "@/src/schema"
import { formatFecha } from "@/src/utils";

export async function createRecibo(data: unknown) {
    const result = ReciboSchema.safeParse(data)

    if (!result.success) {
        return {
            errors: result.error.issues
        }
    }

    // Convertir las fechas a objetos Date
    const { fechaPendiente, fechaGenerado, fechaImpreso, fechaAnulado, estadoReciboId, ...rest } = result.data;

    const reciboData = {
        ...rest,
        fechaPendiente: new Date(fechaPendiente), // Convertir fechaInicio a Date
        fechaGenerado: new Date(),
        fechaImpreso: null,
        fechaAnulado: null,
        estadoReciboId: 2 // Se pasa a estado "GENERADO" 
    };

    // Validar que no se cree un recibo para un mismo contrato en el mismo mes

    const existeRecibo = await prisma.recibo.count({
        where: {
            contratoId: reciboData.contratoId,
            estadoReciboId: {
                not: 4 // 4 es el estado Anulado
            },
            fechaGenerado: {
                not: null
            }
        }
    })

    // Crear el registro en la Tabla de Recibo con el estado "GENERADO"
    if (!existeRecibo) {
        await prisma.recibo.create({
            data: reciboData
        })
    } else {
        return {
            errors: [{ message: "Ya Existe un Recibo Generado para este contrato en este mes" }]
        }
    }

    // Las otras tablas ( Ej. Contrato ) se actualizarán cuando el estado del Recibo sea "IMPRESO"

}