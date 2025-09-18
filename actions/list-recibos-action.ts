"use server"
import { prisma } from "@/src/lib/prisma"

/**
 * Obtiene la lista de recibos con información de contratos y estado
 * Incluye transformación de campos null a strings vacíos para consistencia en frontend
 * @returns Array de recibos con relaciones o array vacío en caso de error
 */
export async function getRecibos() {
    try {
        const recibos = await prisma.recibo.findMany({
            orderBy: {
                id: 'asc' 
            },
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