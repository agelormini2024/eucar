"use server"
import { prisma } from "@/src/lib/prisma"
import { ContratoSchema } from "@/src/schema"

/**
 * Crea un nuevo contrato en el sistema
 * Valida los datos con Zod y verifica que la propiedad no esté ya en uso
 * @param data - Datos del contrato a crear
 * @returns Objeto con success/error y datos/errores correspondientes
 */
export async function createContrato(data: unknown) {
    try {
        // Validar los datos con el esquema de contrato de Zod
        const result = ContratoSchema.safeParse(data)

        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        // Verificar si la propiedad ya está en uso por otro contrato activo
        const existingPropiedad = await prisma.contrato.findFirst({
            where: {
                AND: [
                    { propiedadId: result.data.propiedadId },
                    { cantidadMesesDuracion: { gt: 0 } }
                ]
            }
        });

        if (existingPropiedad) {
            return {
                success: false,
                errors: [{ 
                    path: ['propiedadId'], 
                    message: "La propiedad que desea incluir ya está registrada en otro contrato" 
                }]
            };
        }

        // Convertir las fechas a objetos Date
        const { fechaInicio, fechaVencimiento, ...rest } = result.data;
        const contratoData = {
            ...rest,
            fechaInicio: new Date(fechaInicio), // Convertir fechaInicio a Date
            fechaVencimiento: new Date(fechaVencimiento), // Convertir fechaVencimiento a Date
        };

        // Crear el registro en la base de datos
        const nuevoContrato = await prisma.contrato.create({
            data: contratoData,
        });

        return {
            success: true,
            data: nuevoContrato
        }

    } catch (error) {
        console.error("Error al crear contrato:", error)
        return {
            success: false,
            errors: [{ 
                path: ['general'], 
                message: "Error interno del servidor. Intente nuevamente." 
            }]
        }
    }
} 