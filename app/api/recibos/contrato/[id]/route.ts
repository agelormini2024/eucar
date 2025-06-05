import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
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
    });
    return NextResponse.json(contrato);
}