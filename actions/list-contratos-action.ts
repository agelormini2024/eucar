"use server"
import { prisma } from "@/src/lib/prisma"

export async function getContratos() {
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
            }
        }
        
    
    })
    

    return contratos;
}



