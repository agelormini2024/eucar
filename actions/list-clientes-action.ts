"use server"
import { prisma } from "@/src/lib/prisma";

/**
 * Obtiene la lista de clientes con información geográfica
 * Incluye datos de provincia y país
 * @returns Array de clientes con relaciones o array vacío en caso de error
 */
export async function getClientes() {
    try {
        const clientes = await prisma.cliente.findMany({
            orderBy: {
                apellido: 'asc',
            },
            include: {
                provincia: true,
                pais: true,
            },
        })
        return clientes;
    } catch (error) {
        console.error("Error al obtener clientes:", error)
        return []
    }
}