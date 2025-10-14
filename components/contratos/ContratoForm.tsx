import { prisma } from "@/src/lib/prisma";
import ContratoFormDynamic from "./ContratoFormDynamic";
import { Contrato } from "@prisma/client";

async function getClientes() {
    return await prisma.cliente.findMany({
        orderBy: {
            nombre: "asc",
        },
    });
}

async function getPropiedades() {
    return await prisma.propiedad.findMany({
        orderBy: {
            descripcion: "asc",
        },
    });
}

async function getTiposContrato() {
    return await prisma.tipoContrato.findMany({
        orderBy: {
            descripcion: "asc",
        },
    });
}

async function getTiposIndice() {
    return await prisma.tipoIndice.findMany({
        orderBy: {
            descripcion: "asc",
        },
    });
}

type contratoFormProps = {
    contrato?: Contrato
}

export default async function ContratoForm({ contrato }: contratoFormProps) {

    const clientes = await getClientes();
    const propiedades = await getPropiedades();
    const tiposContrato = await getTiposContrato();
    const tiposIndice = await getTiposIndice();

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">

                <ContratoFormDynamic
                    clientes={clientes} 
                    propiedades={propiedades} 
                    tiposContrato={tiposContrato}
                    tiposIndice={tiposIndice}
                    contrato={contrato}
                />
            </div>
        </>
    )
}
