"use server"

import { prisma } from "@/src/lib/prisma"
import { ClienteSchema } from "@/src/schema"
import { revalidatePath } from "next/cache"


export async function updateCliente(data: unknown, id: number) {
    const result = ClienteSchema.safeParse(data)  // validar los datos con el esquema de cliente de Zod

    if (!result.success) {
        return {
            errors: result.error.issues
        }
    }
    // Verificar si el cuit ya existe
    const existingCliente = await prisma.cliente.findFirst({
        where: {
            AND: [
                { cuit: result.data.cuit },
                { id: { not: id} } 
            ]
        }
        
    });

    if (existingCliente) {
        return {
            errors: [{ message: "El CUIT ya está registrado en el sistema" }]
        };
    }

    await prisma.cliente.update({
        where: {
            id
        },
        data: result.data
    })
    revalidatePath('/admin/clientes/list')
} 