"use server"
import { prisma } from "@/src/lib/prisma";

export async function getPropiedades() {
    const propiedades = await prisma.propiedad.findMany({
        orderBy: {
            cliente: {
                nombre: 'asc', 
            },
        },
        include: {
            provincia: true,
            pais: true,
            tipoPropiedad: true,
            cliente: {
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                },
            },
        },
    })
    return propiedades;
}
