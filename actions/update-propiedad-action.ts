"use server"

import { prisma } from "@/src/lib/prisma";
import { PropiedadSchema } from "@/src/schema";
import { revalidatePath } from "next/cache";

/**
 * Actualiza una propiedad existente en la base de datos
 * @param data - Datos de la propiedad a actualizar
 * @param id - ID de la propiedad a actualizar
 * @returns { success: boolean, data?: Propiedad, errors?: Array }
 */
export async function updatePropiedad(data: unknown, id: number) {
    try {
        // 1. Validar datos de entrada
        const result = PropiedadSchema.safeParse(data);

        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            };
        }

        // 2. Validar que el ID sea válido
        if (!id || isNaN(id) || id <= 0) {
            return {
                success: false,
                errors: [{ 
                    path: ['id'], 
                    message: "ID de propiedad no válido" 
                }]
            };
        }

        // 3. Ejecutar transacción atómica
        const resultado = await prisma.$transaction(async (tx) => {
            // Verificar si la propiedad existe
            const propiedadExistente = await tx.propiedad.findUnique({
                where: { id }
            });

            if (!propiedadExistente) {
                return {
                    success: false,
                    errors: [{ 
                        path: ['id'], 
                        message: "Propiedad no encontrada" 
                    }]
                };
            }

            // Actualizar la propiedad
            const propiedadActualizada = await tx.propiedad.update({
                where: { id },
                data: result.data
            });

            return {
                success: true,
                data: propiedadActualizada
            };
        });

        // 4. Revalidar cache solo si fue exitoso
        if (resultado.success) {
            revalidatePath('/admin/propiedades/list');
        }

        return resultado;

    } catch (error) {
        console.error("Error en updatePropiedad:", error);
        return {
            success: false,
            errors: [{ 
                path: ['server'], 
                message: "Error interno del servidor al actualizar propiedad" 
            }]
        };
    }
}