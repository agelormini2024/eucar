"use client"
import { useEffect, useCallback } from "react";
import { Recibo } from "@prisma/client";
import { useReciboData } from "@/src/hooks/useReciboData";
import { useReciboValidation } from "@/src/hooks/useReciboValidation";
import { Contrato } from "@/src/schema";
import useRecibosFormStore from "@/src/stores/storeRecibos";
import { handleReciboInputChange } from "@/src/utils/recibo/formHandlers";
import ReciboHeader from "./ReciboHeader";
import ReciboAmounts from "./ReciboAmounts";
import ReciboServices from "./ReciboServices";
import ItemsSection from "./ItemsSection";
import { RecibosConRelaciones } from "@/src/types";

type ReciboFormDynamicProps = {
    contrato: Contrato
    recibo?: Recibo | null
    readOnly?: boolean
}

export default function ReciboFormDynamic({ contrato, recibo, readOnly = false }: ReciboFormDynamicProps) {
    const formValues = useRecibosFormStore((state) => state.formValues)
    const setFormValues = useRecibosFormStore((state) => state.setFormValues)
    const resetForm = useRecibosFormStore((state) => state.resetForm)

    // Usar los custom hooks para manejar la lógica
    useReciboData(contrato, recibo as RecibosConRelaciones | null)
    useReciboValidation(contrato, recibo as RecibosConRelaciones | null, readOnly)

    useEffect(() => {
        return () => {
            resetForm();
        };
    }, [resetForm]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        handleReciboInputChange(e, setFormValues);
    }, [setFormValues]);

    return (
        <div className="space-y-6">
            <ReciboHeader 
                contrato={contrato} 
                formValues={formValues} 
                handleInputChange={handleInputChange}
            />
            
            <ReciboAmounts 
                formValues={formValues} 
                handleInputChange={handleInputChange}
                setFormValues={setFormValues}
            />
            
            <ReciboServices 
                formValues={formValues} 
                handleInputChange={handleInputChange}
                readOnly={readOnly}
            />
            
            <div className="border-t pt-6">
                <ItemsSection readOnly={readOnly} />
            </div>
        </div>
    )
}
