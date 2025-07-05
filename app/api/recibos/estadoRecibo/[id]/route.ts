"use server"
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
    
    // Validar el Id
    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        const estadoRecibo = await prisma.estadoRecibo.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!estadoRecibo) {
            return NextResponse.json({ error: "Estado de recibo no encontrado" }, { status: 404 });
        }
        const res = NextResponse.json(estadoRecibo);
        return res
    } catch (error) {
        console.error("Error fetching estado de recibo:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}