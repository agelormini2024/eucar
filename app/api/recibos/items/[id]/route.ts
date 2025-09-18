import { buscarItemsRecibo } from "@/src/lib/buscarItemsRecibo"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const reciboId = parseInt(id)
        
        if (isNaN(reciboId)) {
            return NextResponse.json(
                { error: "ID de recibo inválido" },
                { status: 400 }
            )
        }

        const items = await buscarItemsRecibo(reciboId)
        
        return NextResponse.json(items)
    } catch (error) {
        console.error("Error al buscar ítems del recibo:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}