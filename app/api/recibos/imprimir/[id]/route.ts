import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    
    // Validar el Id
    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        const recibo = await prisma.recibo.findUnique({
            where: { id: Number(id) },
            include: {
                contrato: {
                    include: {
                        clienteInquilino: {
                            select: {
                                apellido: true,
                                nombre: true,
                                cuit: true,
                            }
                        },
                        clientePropietario: {
                            select: {
                                apellido: true,
                                nombre: true,
                                cuit: true,
                            }
                        },
                        propiedad: {
                            select: {
                                calle: true,
                                numero: true,
                                piso: true,
                                departamento: true,
                            }
                        },
                    }
                }
            }
        });

        if (!recibo) {
            return NextResponse.json({ error: "Recibo not found" }, { status: 404 });
        }
        const res = NextResponse.json(recibo);
        return res;

    } catch (error) {
        console.error("Error fetching recibo:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
