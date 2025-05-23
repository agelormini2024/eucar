"use server"

import { prisma } from "@/src/lib/prisma"


export async function getMesesRestanActualizar(id: number ) {
    return await prisma.tipoContrato.findFirst({
        where: {id}
    })
}