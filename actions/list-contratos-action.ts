"use server"
import { prisma } from "@/src/lib/prisma"

export async function getContratos() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const contratos = await prisma.contrato.findMany({
        orderBy: {
            id: 'asc'
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
            },
            recibos: {
                where: {
                    fechaGenerado: {
                        gte: firstDay,
                        lte: lastDay,
                    }
                },
                select: {
                    id: true,
                    montoTotal: true,
                    fechaGenerado: true,
                    fechaImpreso: true,
                }
            }
        }
    })


    return contratos;
}



