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
                cantidadMesesDuracion: { gt: 0 }
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
                },
                recibos: {
                    where: {
                        fechaGenerado: {
                            gte: firstDay,
                            lte: lastDay,
                        }
                    },
                    select: {
                        id: true,
                        montoTotal: true,
                        fechaGenerado: true,
                        fechaImpreso: true,
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



