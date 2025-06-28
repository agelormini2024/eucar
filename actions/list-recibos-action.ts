"use server"

import { prisma } from "@/src/lib/prisma"

export async function getRecibos() {

    const recibos = await prisma.recibo.findMany({
        include: {
            contrato: {
                select: {
                    mesesRestaActualizar: true,
                    clienteInquilino: {
                        select: {
                            apellido: true,
                            nombre: true,
                        }
                    },
                    propiedad: {
                        select: {
                            calle: true,
                            numero: true,
                            piso: true,
                            departamento: true
                        }
                    }
                }
            },
            estadoRecibo: {
                select: {
                    descripcion: true
                }
            }
        }
    });

    return recibos
}