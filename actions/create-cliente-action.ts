"use server"
import { prisma } from "@/src/lib/prisma"
import { ClienteSchema } from "@/src/schema"

/**
 * Crea un nuevo cliente en el sistema
 * Valida los datos con Zod y verifica unicidad del CUIT
 * @param data - Datos del cliente a crear
 * @returns Objeto con success/error y datos/errores correspondientes
 */
export async function createCliente(data: unknown) {
    try {
        // Validar los datos con el esquema de cliente de Zod
        const result = ClienteSchema.safeParse(data)

        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        // Verificar si el cuit ya existe
        const existingCliente = await prisma.cliente.findUnique({
            where: { cuit: result.data.cuit }
        });

        if (existingCliente) {
            return {
                success: false,
                errors: [{ 
                    path: ['cuit'], 
                    message: "El CUIT ya está registrado en el sistema" 
                }]
            };
        }

        // Crear el cliente
        const nuevoCliente = await prisma.cliente.create({
            data: result.data
        })

        return {
            success: true,
            data: nuevoCliente
        }

    } catch (error) {
        console.error("Error al crear cliente:", error)
        return {
            success: false,
            errors: [{ 
                path: ['general'], 
                message: "Error interno del servidor. Intente nuevamente." 
            }]
        }
    }
} 