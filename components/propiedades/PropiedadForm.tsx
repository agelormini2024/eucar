import { prisma } from "@/src/lib/prisma";
import { Propiedad } from "@prisma/client";
import PropiedadFormDynamic from "./PropiedadFormDynamic";

async function getPaises() {
    return await prisma.pais.findMany({
        orderBy: {
            nombre: "asc",
        },
    });
}

async function getProvincias() {
    return await prisma.provincia.findMany({
        orderBy: {
            nombre: "asc",
        },
    });
}

async function getTiposPropiedad() {
    return await prisma.tipoPropiedad.findMany({
        orderBy: {
            nombre: "asc",
        },
    });
}

async function getClientes() {
    return await prisma.cliente.findMany({
        orderBy: {
            nombre: "asc",
        },
    });
}

type PropiedadFormProps = {
    propiedad?: Propiedad
}

export default async function PropiedadForm({ propiedad }: PropiedadFormProps) {

    const paises = await getPaises();
    const provincias = await getProvincias();
    const tiposPropiedad = await getTiposPropiedad();
    const clientes = await getClientes();

    return (
        <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                
                < PropiedadFormDynamic
                    paises={paises}
                    provincias={provincias}
                    propiedad={propiedad}
                    tiposPropiedad={tiposPropiedad}
                    clientes={clientes}

                />
            </div>
        </>
    )
}
