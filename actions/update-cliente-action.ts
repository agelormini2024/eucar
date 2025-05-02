"use server"

import { prisma } from "@/src/lib/prisma"
import { ClienteSchema } from "@/src/schema"
import { revalidatePath } from "next/cache"


export async function updateCliente(data: unknown, id: number) {
    const result = ClienteSchema.safeParse(data)  // Validar (del lado del servidor) los datos con el esquema de Cliente de Zod

    if (!result.success) {
        return {
            errors: result.error.issues
        }
    }
    // Verificar si el cuit ya existe
    // Excluir el cliente actual de la búsqueda
    // Se usa la transacción para asegurar que ambas operaciones se realicen de manera atómica
    // Si una falla, la otra no se ejecuta
    await prisma.$transaction(async (tx) => {
        const existingCliente = await prisma.cliente.findFirst({
            where: {
                AND: [
                    { cuit: result.data.cuit },
                    { id: { not: id } }
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
    })
    revalidatePath('/admin/clientes/list')
} 