"use server"
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function buscarContratoParaRecibo(id: number) {

    try {
        const contrato = await prisma.contrato.findFirst({
            where: {
                id
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

        return contrato;

    } catch (error) {
        console.error("Error en el fetching de Contrato: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }


}