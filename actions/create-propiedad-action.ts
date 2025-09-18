"use server"

import { prisma } from "@/src/lib/prisma";
import { PropiedadSchema } from "@/src/schema";

/**
 * Crea una nueva propiedad en el sistema
 * Valida los datos con Zod y verifica unicidad de la dirección completa
 * @param data - Datos de la propiedad a crear
 * @returns Objeto con success/error y datos/errores correspondientes
 */
export async function createPropiedad(data: unknown) {
    try {
        // Validar los datos con el esquema de propiedad de Zod
        const result = PropiedadSchema.safeParse(data)

        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        // Verificar si la propiedad ya existe (mismo domicilio completo)
        const existingPropiedad = await prisma.propiedad.findFirst({
            where: {
                calle: result.data.calle,
                numero: result.data.numero,
                piso: result.data.piso,
                departamento: result.data.departamento,
                localidad: result.data.localidad,
                provinciaId: result.data.provinciaId,
                codigoPostal: result.data.codigoPostal
            }
        });

        if (existingPropiedad) {
            return {
                success: false,
                errors: [{ 
                    path: ['direccion'], 
                    message: "La propiedad ya está registrada en el sistema" 
                }]
            };
        }

        // Crear la propiedad
        const nuevaPropiedad = await prisma.propiedad.create({
            data: result.data
        })

        return {
            success: true,
            data: nuevaPropiedad
        }

    } catch (error) {
        console.error("Error al crear propiedad:", error)
        return {
            success: false,
            errors: [{ 
                path: ['general'], 
                message: "Error interno del servidor. Intente nuevamente." 
            }]
        }
    }
}