"use server"
import { prisma } from "@/src/lib/prisma";

export async function getContratos() {
    const clientes = await prisma.contrato.findMany({
        orderBy: {
            descripcion: 'asc',
        },
     })
    return clientes; 
}