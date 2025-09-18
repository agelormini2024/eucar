import { prisma } from "./prisma"

export async function buscarItemsRecibo(reciboId: number) {
    try {
        const items = await prisma.itemRecibo.findMany({
            where: {
                reciboId: reciboId
            },
            select: {
                descripcion: true,
                monto: true
            },
            orderBy: {
                id: 'asc' // Mantener el orden original
            }
        })
        
        return items
    } catch (error) {
        console.error("Error al buscar ítems del recibo:", error)
        return []
    }
}