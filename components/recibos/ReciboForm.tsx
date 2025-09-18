"use server"
import { buscarContratoParaRecibo } from "@/src/lib/buscarContratoPara Recibo";
import ReciboFormDynamic from "./ReciboFormDynamic";
import { ContratoSchemaApi } from "@/src/schema";
import { Recibo } from "@prisma/client";

type ReciboFormProps = {
    contrato: number
    recibo?: Recibo | null
}

export default async function ReciboForm({ contrato, recibo }: ReciboFormProps) {

    const result = await buscarContratoParaRecibo(contrato)
    const parsed = ContratoSchemaApi.safeParse(result) // Validar contrato con zod

    if (!parsed.success) {
        return <div>Error al cargar el contrato</div>
    }

    const contratoSeleccionado = parsed.data

    return (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            <ReciboFormDynamic
                contrato={contratoSeleccionado}
                recibo={recibo}
            />
        </div>
    )
}
