import { prisma } from "@/src/lib/prisma"
import { Recibo } from "@prisma/client";
import ReciboFormDynamic from "./ReciboFormDynamic";


async function getContrato() {
    return await prisma.contrato.findMany({
        where: {
            fechaVencimiento: {
                gte: new Date(),
            }
        },
        include: {
            clientePropietario: {
                select: {
                    apellido: true,
                    nombre: true,
                    cuit: true,
                }
            },
        }
    })
}

type ReciboFormProps = {
    recibo?: Recibo;
}

export default async function ReciboForm({ recibo }: ReciboFormProps) {

    const contratos = await getContrato()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            <ReciboFormDynamic
                contratos={contratos}
                recibo={recibo}
            />
        </div>
    )
}
