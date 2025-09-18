"use server"
import { prisma } from "@/src/lib/prisma"

/**
 * Obtiene la lista de tipos de contrato ordenados por cantidad de meses de actualización
 * @returns Array de tipos de contrato o array vacío en caso de error
 */
export async function getTipoContrato() {
    try {
        const tipoContrato = await prisma.tipoContrato.findMany({
            orderBy: {cantidadMesesActualizacion: 'asc'}
        })  
        return tipoContrato
    } catch (error) {
        console.error("Error al obtener tipos de contrato:", error)
        return []
    }
}