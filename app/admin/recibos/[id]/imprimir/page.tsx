import ImprimirRecibo from "@/components/recibos/ImprimirRecibo";
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";

async function getReciboById(id: number) {
    const recibo = await prisma.recibo.findUnique({
        where: { id },
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
        notFound()
    }

    return recibo;
}

export default async function ImprimirReciboPage({ params }: { params: { id: string } }) {

    const { id } = await params; // Asegúrate de que params sea awaited si es necesario

    const recibo = await getReciboById(+id)

    return (
        <>
            {/* <div className="text-2xl">{recibo.contrato.clienteInquilino.apellido} </div> */}
            <ImprimirRecibo recibo={recibo} />
        </>

    )
}
