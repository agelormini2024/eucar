"use server"
import { prisma } from "@/src/lib/prisma"
import { IpcFinal } from "@/src/schema"


export async function getIpc(inflacionMensual: unknown) {
    const result = IpcFinal.safeParse(inflacionMensual)

    if (!result.success) {
        console.error("Falló la validación de Zod: ", result.error)
        return
    }

    try {
        // Hay que usar for of porque el .map no espera a que se resuelvan las promesas
        // y no se puede usar Promise.all porque no se puede usar await dentro de un .map
        for (const item of result.data) {

            await prisma.ipc.upsert({
                where: { annoMes: item.fecha },
                update: { porcentaje: item.inflacion },
                create: { annoMes: item.fecha, porcentaje: item.inflacion }
            })
        }
        
        // Calcular el IPC acumulado de los últimos 12 meses

        const cntTiposContrato = await prisma.tipoContrato.findMany({
            select: {
                id: true,
                cantidadMesesActualizacion: true
            }
        })

        for (const reg of cntTiposContrato) {

            const ipcAcumulado = await prisma.ipc.findMany({
                orderBy: { annoMes: 'desc' },
                take: reg.cantidadMesesActualizacion,
                select: {
                    annoMes: true,
                    porcentaje: true
                }
            })

            // Si hay datos, calcular el IPC total y actualizar el tipoContrato

            if (ipcAcumulado.length > 0) {
                const ipcTotal = ipcAcumulado.reduce((acc, item) => acc * (item.porcentaje / 100 + 1), 1)
                console.log("ipcTotal", ipcTotal)
                // const ipcAnual = ipcTotal / tipoContrato.cantidadMesesActualizacion
                await prisma.tipoContrato.update({
                    where: { cantidadMesesActualizacion: reg.cantidadMesesActualizacion },
                    data: { ipc: ipcTotal,
                            ultimaActualizacion: new Date()
                     }
                })
            }

        }
        console.log("IPC actualizado correctamente")



    } catch (error) {
        console.error(error)
    }
}