"use server"
import { prisma } from "@/src/lib/prisma"
import { ClienteSchema } from "@/src/schema"
import { revalidatePath } from "next/cache"

/**
 * Actualiza un cliente existente en la base de datos
 * @param data - Datos del cliente a actualizar
 * @param id - ID del cliente a actualizar
 * @returns { success: boolean, data?: Cliente, errors?: Array }
 */
export async function updateCliente(data: unknown, id: number) {
    try {
        // 1. Validar datos de entrada
        const result = ClienteSchema.safeParse(data);

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
                    message: "ID de cliente no válido" 
                }]
            };
        }

        // 3. Ejecutar transacción atómica
        const resultado = await prisma.$transaction(async (tx) => {
            // Verificar si el cliente existe
            const clienteExistente = await tx.cliente.findUnique({
                where: { id }
            });

            if (!clienteExistente) {
                return {
                    success: false,
                    errors: [{ 
                        path: ['id'], 
                        message: "Cliente no encontrado" 
                    }]
                };
            }

            // Verificar si el CUIT ya existe en otro cliente
            const clienteConMismoCuit = await tx.cliente.findFirst({
                where: {
                    AND: [
                        { cuit: result.data.cuit },
                        { id: { not: id } }
                    ]
                }
            });

            if (clienteConMismoCuit) {
                return {
                    success: false,
                    errors: [{ 
                        path: ['cuit'], 
                        message: "El CUIT ya está registrado en otro cliente" 
                    }]
                };
            }

            // Actualizar el cliente
            const clienteActualizado = await tx.cliente.update({
                where: { id },
                data: result.data
            });

            return {
                success: true,
                data: clienteActualizado
            };
        });

        // 4. Revalidar cache solo si fue exitoso
        if (resultado.success) {
            revalidatePath('/admin/clientes/list');
        }

        return resultado;

    } catch (error) {
        console.error("Error en updateCliente:", error);
        return {
            success: false,
            errors: [{ 
                path: ['server'], 
                message: "Error interno del servidor al actualizar cliente" 
            }]
        };
    }
} 