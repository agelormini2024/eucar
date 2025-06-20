import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
    
    // Validar el Id
    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        
        const propiedad = await prisma.propiedad.findFirst({
            where: {
                id: Number(id)
            }
        });

        const propietario = await prisma.cliente.findFirst({
            where: {
                id: propiedad?.clienteId
            }
        })

        if (!propietario || ! propiedad) {
            return NextResponse.json({ error: "Problemas con los modelos propiedad y cliente" }, { status: 404 });
        }

        return NextResponse.json(propietario);
    } catch (error) {
        console.error("Error fetching estado de recibo:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}