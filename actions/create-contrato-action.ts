"use server"
import { prisma } from "@/src/lib/prisma"
import { ContratoSchema } from "@/src/schema"


export async function createContrato(data: unknown) {

    const result = ContratoSchema.safeParse(data)  // validar los datos con el esquema de contrato de Zod

    if (!result.success) {
        return {
            errors: result.error.issues
        }
    }

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
            errors: [{ message: "La propiedad que desea incluir ya está registrada en Otro Contrato" }]
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
    await prisma.contrato.create({
        data: contratoData,
    });
} 