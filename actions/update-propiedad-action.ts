"use server"

import { prisma } from "@/src/lib/prisma";
import { PropiedadSchema } from "@/src/schema";
import { revalidatePath } from "next/cache";




export async function updatePropiedad(data: unknown, id: number) {

    const result = PropiedadSchema.safeParse(data)  // validar los datos con el esquema de propiedad de Zod

    if (!result.success) {
        return {
            errors: result.error.issues
        }
    }
    // En este caso, usamos $transaction para asegurarnos que no haya concurrencia 
    // en la base de datos sobre el mismo registro
    // Si una falla, la otra no se ejecuta
    // En este caso, solo actualizamos la propiedad, pero si tuvieras más operaciones, las incluirías aquí
    // await prisma.$transaction(async (tx) => {
    // Si una falla, la otra no se ejecuta
    await prisma.$transaction(async (tx) => {
        const propiedad = await tx.propiedad.update({
            where: {
                id
            },
            data: result.data
        })
    })

    revalidatePath('/admin/propiedades/list')
}