"use server"

import { prisma } from "@/src/lib/prisma"
import { ClienteSchema } from "@/src/schema"


export async function createCliente(data: unknown) {
    const result = ClienteSchema.safeParse(data)  // validar los datos con el esquema de cliente de Zod

    if (!result.success) {
        return {
            errors: result.error.issues
        }
    }
    // Verificar si el cuit ya existe
    const existingCliente = await prisma.cliente.findUnique({
        where: { cuit: result.data.cuit }
    });

    if (existingCliente) {
        return {
            errors: [{ message: "El CUIT ya está registrado en el sistema" }]
        };
    }

    await prisma.cliente.create({
        data: result.data
    })
} 