"use server"
import { buscarReciboMesActual } from "@/src/lib/buscarRecibo"
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

    const existeRecibo = await buscarReciboMesActual(reciboData.contratoId);

    const meses = await prisma.contrato.findUnique({
        where: { id: reciboData.contratoId },
        select: {
            mesesRestaActualizar: true,
            cantidadMesesDuracion: true,
            tipoContrato: {
                select: {
                    cantidadMesesActualizacion: true,
                }
            }
        }
    })
    console.log("🚀 ~ createRecibo ~ mesesActual:", meses)

    const mesesActual = meses?.mesesRestaActualizar
    const mesesReset = meses?.tipoContrato.cantidadMesesActualizacion

    let nuevoValorMeses
    if (typeof mesesActual === "number" && mesesActual > 0) {
        // Decrementar en 1
        nuevoValorMeses = { decrement: 1 };
    } else {
        // Resetear al valor de cantidadMesesActualizacion
        nuevoValorMeses = mesesReset;
    }

    // Al implementar $transaction, se asegura que si falla una de las operaciones, ninguna se ejecuta
    try {
        const result = await prisma.$transaction(async (tx) => {
            reciboData.estadoReciboId = 2 // "GENERADO"
            reciboData.fechaGenerado = new Date().toISOString() // Fecha actual para el recibo generado en formato string

            if (!existeRecibo) {
                if (reciboData.montoTotal === 0) { // Si el monto total es 0, se considera que quedará "Pendiente"
                    reciboData.estadoReciboId = 1 // "Pendiente" si el monto total es 0
                } else {
                    await tx.contrato.update({
                        where: { id: reciboData.contratoId },
                        data: {
                            montoAlquilerUltimo: reciboData.montoTotal,
                            mesesRestaActualizar: nuevoValorMeses,    // Decrementar "mesesRestaActualizar" y si es 0 se actualiza con lo que hay 
                            cantidadMesesDuracion: { decrement: 1 }  // en la tabla tipoContrato en "cantidadMesesActualizacion". 
                        }
                    })                    
                }
                await tx.recibo.create({ data: reciboData })
                return { success: true };

            } else if (existeRecibo.estadoReciboId === 1 && reciboData.montoTotal !== 0) { // "Pendiente"
                // Solo actualizar contrato y pasar el estado del recibo a "GENERADO"

                await tx.recibo.update({
                    where: { id: existeRecibo.id },
                    data: reciboData
                });
                await tx.contrato.update({
                    where: { id: reciboData.contratoId },
                    data: {
                        montoAlquilerUltimo: reciboData.montoTotal,
                        mesesRestaActualizar: nuevoValorMeses,
                        cantidadMesesDuracion: { decrement: 1 }
                    }
                });
                return { success: true };
            } else if (existeRecibo.estadoReciboId === 1 && reciboData.montoTotal === 0) { // "Pendiente"

                return {
                    errors: [{ message: "Todavía no están los Indices necesarios para generar el recibo." }]
                }

            } else if (existeRecibo.estadoReciboId === 2) { // "GENERADO"

                return {
                    errors: [{ message: "Ya existe un recibo generado para este contrato." }]
                };
            }
            return { success: false };
        });

        if (result?.errors) {
            return result;
        }
    } catch (error) {
        return {
            errors: [{ message: "Error en la transacción", detail: error }]
        }
    }

}