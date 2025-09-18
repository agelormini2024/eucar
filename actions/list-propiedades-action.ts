"use server"
import { prisma } from "@/src/lib/prisma";

/**
 * Obtiene la lista de propiedades con sus relaciones
 * Incluye información de provincia, país, tipo de propiedad y cliente propietario
 * @returns Array de propiedades con relaciones o array vacío en caso de error
 */
export async function getPropiedades() {
    try {
        const propiedades = await prisma.propiedad.findMany({
            orderBy: {
                cliente: {
                    nombre: 'asc', 
                },
            },
            include: {
                provincia: true,
                pais: true,
                tipoPropiedad: true,
                cliente: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                    },
                },
            },
        })
        return propiedades;
    } catch (error) {
        console.error("Error al obtener propiedades:", error)
        return []
    }
}
