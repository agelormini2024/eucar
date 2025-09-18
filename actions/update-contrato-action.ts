"use server"

import { prisma } from "@/src/lib/prisma"
import { ContratoSchema } from "@/src/schema"
import { revalidatePath } from "next/cache"

/**
 * Actualiza un contrato existente en la base de datos
 * @param data - Datos del contrato a actualizar
 * @param id - ID del contrato a actualizar
 * @returns { success: boolean, data?: Contrato, errors?: Array }
 */
export async function updateContrato(data: unknown, id: number) {
    try {
        // 1. Validar datos de entrada
        const result = ContratoSchema.safeParse(data);

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
                    message: "ID de contrato no válido" 
                }]
            };
        }

        // 3. Convertir fechas a objetos Date
        const { fechaInicio, fechaVencimiento, ...rest } = result.data;
        const contratoData = {
            ...rest,
            fechaInicio: new Date(fechaInicio),
            fechaVencimiento: new Date(fechaVencimiento)
        };

        // 4. Ejecutar transacción atómica
        const resultado = await prisma.$transaction(async (tx) => {
            // Verificar si el contrato existe
            const contratoExistente = await tx.contrato.findUnique({
                where: { id }
            });

            if (!contratoExistente) {
                return {
                    success: false,
                    errors: [{ 
                        path: ['id'], 
                        message: "Contrato no encontrado" 
                    }]
                };
            }

            // Verificar si la propiedad ya está registrada en otro contrato activo
            const propiedadEnUso = await tx.contrato.findFirst({
                where: {
                    AND: [
                        { propiedadId: contratoData.propiedadId },
                        { id: { not: id } }, // Excluir el contrato actual
                        { cantidadMesesDuracion: { gt: 0 } } // Solo contratos activos
                    ]
                }
            });

            if (propiedadEnUso) {
                return {
                    success: false,
                    errors: [{ 
                        path: ['propiedadId'], 
                        message: "La propiedad ya está registrada en otro contrato activo" 
                    }]
                };
            }

            // Actualizar el contrato
            const contratoActualizado = await tx.contrato.update({
                where: { id },
                data: contratoData
            });

            return {
                success: true,
                data: contratoActualizado
            };
        });

        // 5. Revalidar cache solo si fue exitoso
        if (resultado.success) {
            revalidatePath('/admin/contratos/list');
        }

        return resultado;

    } catch (error) {
        console.error("Error en updateContrato:", error);
        return {
            success: false,
            errors: [{ 
                path: ['server'], 
                message: "Error interno del servidor al actualizar contrato" 
            }]
        };
    }
}