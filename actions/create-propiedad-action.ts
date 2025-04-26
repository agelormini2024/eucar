"use server"

import { prisma } from "@/src/lib/prisma";
import { PropiedadSchema } from "@/src/schema";

export async function createPropiedad(data: unknown) {
    // Validar los datos con el esquema de propiedad de Zod
    const result = PropiedadSchema.safeParse(data)

    if (!result.success) {
        return {
            errors: result.error.issues
        }
    }

    // // Verificar si la propiedad ya existe
    // const existingPropiedad = await prisma.propiedad.findUnique({
    //     where: { descripcion: result.data.descripcion }
    // });

    // if (existingPropiedad) {
    //     return {
    //         errors: [{ message: "La propiedad ya está registrada en el sistema" }]
    //     };
    // }

    await prisma.propiedad.create({
        data: result.data
    })
}