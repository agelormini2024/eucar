import ContratoForm from "@/components/contratos/ContratoForm"
import EditContratoForm from "@/components/contratos/EditContratoForm"
import ButtonGoBack from "@/components/ui/ButtonGoBack"
import Headers from "@/components/ui/Headers"
import { prisma } from "@/src/lib/prisma"
import { Contrato } from "@prisma/client"
import { notFound } from "next/navigation"


type getContratoByIdProps = {
    id: Contrato["id"]
}

async function getContratoById({id}: getContratoByIdProps) {

    const contrato = await prisma.contrato.findUnique({
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
        notFound()
    }

    return contrato
}

export default async function EditContratoPage({ params }: { params: { id: string } }) {

    const { id } = await params // Asegúrate de que params sea awaited si es necesario

    const contrato = await getContratoById({ id: +id })

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <Headers>Editar Contrato: {contrato?.descripcion}</Headers>
                </div>
                <div>
                    <ButtonGoBack />
                </div>
            </div>
            <div>
                <EditContratoForm>
                    <ContratoForm
                        contrato={contrato}
                    />
                </EditContratoForm>
            </div>

        </>
    )
}
