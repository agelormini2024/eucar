"use server"
import { prisma } from "@/src/lib/prisma";

export async function getClientes() {
    const clientes = await prisma.cliente.findMany({
        orderBy: {
            apellido: 'asc',
        },
        include: {
            provincia: true,
            pais: true,
        },
    })
    return clientes; 
}