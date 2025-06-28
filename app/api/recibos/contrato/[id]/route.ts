import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;

    // Validar el Id
    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    
    // Aquí se podría validar si ya hay un Recibo GENERADO para este contrato en el mes en curso
    // Esta Validación también se encuentra en la acción "create-recibo-action.ts"

    try {
        const contrato = await prisma.contrato.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                tipoContrato: true,
                tipoIndice: true,
                propiedad: {
                    select: {
                        calle: true,
                        numero: true,
                        piso: true,
                        departamento: true,
                    }
                },
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
                }
            }
        })

        if (!contrato) {
            return NextResponse.json({ error: "Contrato NO Encontrado...." }, { status: 404 })
        }
        return NextResponse.json(contrato);

    } catch (error) {
        console.error("Error en el fetching de Contrato: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }


}