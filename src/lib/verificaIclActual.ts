"use server"
import { prisma } from "@/src/lib/prisma"

/**
 * Verifica si existe un índice ICL disponible para una fecha dada.
 * 
 * Busca un índice ICL que esté dentro del mes de la fecha de generación.
 * No importa si hay índices futuros en el mes.
 * 
 * @param fechaGeneracion - Fecha para la cual se necesita el índice ICL
 * @returns true si existe al menos un índice en el mes actual, false en caso contrario
 * 
 * @example
 * // Para un recibo con fechaGeneracion = 2024-11-15
 * // Busca ICL con fecha dentro del mes 2024-11
 * const disponible = await verificaIclActual(new Date('2024-11-15'));
 * // Retorna true si existe ICL en cualquier momento de noviembre 2024
 */
export async function verificaIclActual(fechaGeneracion: Date): Promise<boolean> {
  try {
    // Obtener año y mes de la fecha de generación
    const year = fechaGeneracion.getFullYear();
    const month = fechaGeneracion.getMonth(); // 0-indexed
    
    // Crear inicio del mes
    const inicioMes = new Date(year, month, 1);
    
    // Crear inicio del mes siguiente
    const inicioMesSiguiente = new Date(year, month + 1, 1);

    // Buscar cualquier índice ICL dentro del mes actual
    const indiceIcl = await prisma.icl.findFirst({
      where: {
        fecha: {
          gte: inicioMes,              // Mayor o igual al inicio del mes
          lt: inicioMesSiguiente,      // Menor que el inicio del mes siguiente
        }
      }
    });

    return indiceIcl !== null;
  } catch (error) {
    console.error('Error al verificar índice ICL:', error);
    return false;  // En caso de error, asumir que no está disponible
  }
}
