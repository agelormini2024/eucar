"use server"
import { prisma } from "./prisma";


export async function buscarReciboById(id: number) {

    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const recibo = await prisma.recibo.findFirst({
            where: {
                id,
                estadoReciboId: { not: 5 }, // Excluir "ANULADO"
                OR: [
                    {
                        // Recibos con fechaGenerado del mes actual
                        fechaGenerado: {
                            gte: firstDay,
                            lte: lastDay,
                        }
                    },
                    {
                        // Recibos PENDIENTES (fechaGenerado es null) con fechaPendiente del mes actual
                        fechaGenerado: null,
                        fechaPendiente: {
                            gte: firstDay,
                            lte: lastDay,
                        }
                    }
                ]
            },
            include: {
                contrato: {
                    select:{
                        mesesRestaActualizar: true,
                        tipoContrato: {
                            select: {
                                cantidadMesesActualizacion: true,
                            }
                        },
                        
                    }
                }
            }
        });

        if (!recibo) {
            return null; // No se encontró ningún recibo
        }

        return recibo;

    } catch (error) {
        console.error("Error al buscar el recibo:", error);
        throw new Error("Error al buscar el recibo");
    }
}
