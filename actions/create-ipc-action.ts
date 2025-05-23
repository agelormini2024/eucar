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
            const existingIpc = await prisma.ipc.findUnique({
                where: { annoMes: item.fecha }
            });
        
            if (existingIpc) {
                await prisma.ipc.update({
                    where: { annoMes: item.fecha },
                    data: { porcentaje: item.inflacion }
                });
            } else {
                await prisma.ipc.create({
                    data: {
                        annoMes: item.fecha,
                        porcentaje: item.inflacion
                    }
                });
            }
        }
    } catch (error) {
        console.error(error)
    }
}