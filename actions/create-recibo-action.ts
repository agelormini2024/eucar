"use server"
import { prisma } from "@/src/lib/prisma"
import { ReciboSchema } from "@/src/schema"

export async function createRecibo(data: unknown) {

    const result = ReciboSchema.safeParse(data)

    if (!result.success) {
        return {
            errors: result.error.issues
        }
    }

    // Convertir las fechas a objetos Date
    const { fechaPendiente, fechaImpreso, fechaAnulado, ...rest } = result.data;

    const reciboData = {
        ...rest,
        fechaPendiente: new Date(fechaPendiente), // Convertir fechaInicio a Date
        fechaImpreso: null,
        fechaAnulado: null
    };

    // Validar que no se cree un recibo para un mismo contrato en el mismo mes

    const existeRecibo = await prisma.recibo.findFirst({
        where: {
            contratoId: reciboData.contratoId,
            estadoReciboId: {
                not: 4, // "ANULADO"
            },
            fechaGenerado: null, // Solo los recibos que no estén generados
        }
    })

    // Crear el registro en la Tabla de Recibo con el estado "GENERADO"
    // Al implementar $transaction, se asegura que si falla una de las operaciones, ninguna se ejecuta
    try {
        await prisma.$transaction(async (tx) => {
            reciboData.estadoReciboId = 2; // "GENERADO"
            reciboData.fechaGenerado = new Date().toISOString(); // Fecha actual para el recibo generado en formato string
            if (!existeRecibo) {
                // Crear recibo y actualizar contrato en la misma transacción
                await tx.recibo.create({ data: reciboData });
                await tx.contrato.update({
                    where: { id: reciboData.contratoId },
                    data: {
                        montoAlquilerUltimo: reciboData.montoTotal,
                        mesesRestaActualizar: { decrement: 1 },
                    }
                });
            } else if (existeRecibo.estadoReciboId === 1) { // "Pendiente"
                // Solo actualizar contrato si ya hay un recibo pendiente
                await tx.recibo.update({
                    where: { id: existeRecibo.id },
                    data: reciboData
                });
                await tx.contrato.update({
                    where: { id: reciboData.contratoId },
                    data: {
                        montoAlquilerUltimo: reciboData.montoTotal,
                        mesesRestaActualizar: { decrement: 1 },
                    }
                });
            } 
            // Si existeRecibo y no está pendiente, no se hace nada
        });
    } catch (error) {
        return {
            errors: [{ message: "Error en la transacción", detail: error }]
        }
    }    // Las otras tablas ( Ej. Contrato ) se actualizarán cuando el estado del Recibo sea "IMPRESO"

}