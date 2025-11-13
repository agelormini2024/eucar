"use server"
import { prisma } from "@/src/lib/prisma"

/**
 * Obtiene la lista de recibos con información de contratos y estado
 * Incluye transformación de campos null a strings vacíos para consistencia en frontend
 * @param mes - Mes a filtrar (1-12), opcional
 * @param año - Año a filtrar, opcional
 * @returns Array de recibos con relaciones o array vacío en caso de error
 */
export async function getRecibos(mes?: number, año?: number) {
    try {
        // Construir filtros de fecha si se proporcionan mes y año
        let dateFilter = {};

        if (mes && año) {
            // Crear fecha de inicio (primer día del mes)
            const fechaInicio = new Date(año, mes - 1, 1);

            // Crear fecha fin (primer día del mes siguiente)
            const fechaFin = new Date(año, mes, 1);
            
            // Filtrar por fechaGenerado O por fechaPendiente si está PENDIENTE
            // Esto permite ver tanto recibos generados como pendientes del mes
            dateFilter = {
                OR: [
                    {
                        // Recibos ya generados en este mes
                        fechaGenerado: {
                            gte: fechaInicio,
                            lt: fechaFin
                        }
                    },
                    {
                        // Recibos pendientes de este mes (esperando índices)
                        fechaPendiente: {
                            gte: fechaInicio,
                            lt: fechaFin
                        },
                        estadoReciboId: 1 // Solo pendientes
                    }
                ]
            };
        }

        const recibos = await prisma.recibo.findMany({
            where: dateFilter,
            orderBy: [
                // Primero ordenar por estado (pendientes primero para que sean visibles)
                { estadoReciboId: 'asc' },
                // Luego por fecha pendiente descendente (más reciente primero)
                { fechaPendiente: 'desc' }
            ],
            include: {
                contrato: {
                    select: {
                        mesesRestaActualizar: true,
                        clienteInquilino: {
                            select: {
                                apellido: true,
                                nombre: true,
                            }
                        },
                        propiedad: {
                            select: {
                                calle: true,
                                numero: true,
                                piso: true,
                                departamento: true
                            }
                        }
                    }
                },
                estadoRecibo: {
                    select: {
                        descripcion: true
                    }
                }
            }
        });
        // Mapear para asegurar que piso y departamento sean string, no null
        // Esto es necesario porque en la base de datos pueden ser null y en el frontend queremos
        // que sean cadenas vacías en lugar de null.
        const mappedData = recibos.map(recibo => ({
            ...recibo,
            contrato: {
                ...recibo.contrato,
                propiedad: {
                    ...recibo.contrato.propiedad,
                    piso: recibo.contrato.propiedad.piso ?? "",
                    departamento: recibo.contrato.propiedad.departamento ?? "",
                }
            }
        }));

        return mappedData
    } catch (error) {
        console.error("Error fetching recibos:", error);
        return [];
    }

}