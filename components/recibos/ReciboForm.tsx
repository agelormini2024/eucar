"use server"
import { buscarContratoParaRecibo } from "@/src/lib/buscarContratoPara Recibo";
import ReciboFormDynamic from "./ReciboFormDynamic";
import { ContratoSchemaApi } from "@/src/schema";

type ReciboFormProps = {
    contrato: number
}

export default async function ReciboForm({ contrato }: ReciboFormProps) {

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
            />
        </div>
    )
}
