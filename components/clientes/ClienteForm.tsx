import { prisma } from "@/src/lib/prisma";
import ClienteFormDynamic from "./ClienteFormDynamic";
import { Cliente } from "@prisma/client";

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
type ClienteFormProps = {
    cliente?: Cliente
}

export default async function ClienteForm({cliente}: ClienteFormProps) {
    const paises = await getPaises();
    const provincias = await getProvincias();

    return (
        <>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                <ClienteFormDynamic 
                    paises={paises} 
                    provincias={provincias}
                    cliente={cliente} 
                />
            </div>
        </>
    );
}