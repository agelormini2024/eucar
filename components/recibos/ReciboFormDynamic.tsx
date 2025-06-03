"use client";
import useRecibosFormStore from "@/src/stores/storeRecibos";
import { Contrato, Recibo } from "@prisma/client";
import { useEffect } from "react";

type ReciboFormDynamicProps = {
    contratos: Contrato[]
    recibo?: Recibo
}

export default function ReciboFormDynamic({ contratos, recibo }: ReciboFormDynamicProps) {

    const formValues = useRecibosFormStore((state) => state.formValues)
    const setFormValues = useRecibosFormStore((state) => state.setFormValues)

    useEffect(() => {
        if (recibo?.montoTotal) {
            setFormValues({
                contratoId: recibo.contratoId || 0
            })
        }
    }, [recibo, setFormValues])

    //------------------------------------------------------------------------------------
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target as HTMLInputElement;
        let parsedValue: string | number | boolean = ""
        
        if (name === "contratoId") {
            // Datos del Contrato
            const contrato = await fetch(`/api/recibos/contrato/${Number(value)}`).then(res => res.json())
            console.log(contrato)
            // ------------------
        }
        
        if (type === "checkbox") {
            parsedValue = (e.target as HTMLInputElement).checked
        } else if (
            type === "number" ||
            name === "contratoId"
        ) {
            parsedValue = Number(value)
            
        } else {
            parsedValue = value
        }
        
        setFormValues({ [name]: parsedValue });
    }

    return (
        <div className="space-y-2">
            <label className="text-slate-800 font-bold"
                htmlFor="contratoId">
                Contrato :
            </label>
            <select
                className="block w-full p-3 bg-slate-200"
                id="contratoId"
                name="contratoId"
                onChange={handleInputChange}
            >
                <option value="">-- Seleccione un Contrato --</option>
                {contratos.map((item) => (
                    <option
                        key={item.id}
                        value={item.id}
                    >
                        {item.descripcion}
                    </option>
                ))}
            </select>
        </div>
    )
}
