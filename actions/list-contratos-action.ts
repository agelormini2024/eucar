"use server"
import { prisma } from "@/src/lib/prisma"

/**
 * Obtiene la lista de contratos activos con sus relaciones
 * Incluye filtrado de recibos del mes actual
 * @returns Array de contratos con relaciones o array vacío en caso de error
 */
export async function getContratos() {
    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const contratos = await prisma.contrato.findMany({
            where: {
                cantidadMesesDuracion: { gt: 0 },
                // Solo contratos que NO tienen recibos del mes actual (excepto anulados)
                NOT: {
                    recibos: {
                        some: {
                            estadoReciboId: { not: 5 }, // Excluir ANULADOS
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
                        }
                    }
                }
            },
            orderBy: {
                id: 'asc'
            },
            include: {
                tipoContrato: true,
                tipoIndice: true,
                propiedad: {
                    select: {
                        calle: true,
                        numero: true,
                        piso: true,
                        departamento: true,
                    }
                },
                clienteInquilino: {
                    select: {
                        apellido: true,
                        nombre: true,
                        cuit: true,
                    }
                },
                clientePropietario: {
                    select: {
                        apellido: true,
                        nombre: true,
                        cuit: true,
                    }
                }
            }
        })

        return contratos;
    } catch (error) {
        console.error("Error al obtener contratos:", error)
        return []
    }
}



