"use server"
import { buscarContratoParaRecibo } from "@/src/lib/buscarContratoParaRecibo";
import ReciboFormDynamic from "./ReciboFormDynamic";
import { ContratoSchemaApi } from "@/src/schema";
import { Recibo } from "@prisma/client";
import ErrorComponent from "../ui/ErrorComponent";

type ReciboFormProps = {
    contrato: number
    recibo?: Recibo | null
}

/**
 * Componente servidor que carga y valida el contrato para el formulario de recibo
 */
export default async function ReciboForm({ contrato, recibo }: ReciboFormProps) {
    // Validación mínima defensiva sin try/catch para evitar problemas de sesión
    if (!contrato || contrato <= 0) {
        return <ErrorComponent message="ID de recibo inválido" />;
    }

    try {
        // Buscar el contrato
        const result = await buscarContratoParaRecibo(contrato);
        
        if (!result) {
            return <ErrorComponent message="Contrato no encontrado" />;
        }

        // Validación de Zod simplificada
        const parsed = ContratoSchemaApi.safeParse(result);
        if (!parsed.success) {
            console.error("Error validando contrato:", parsed.error);
            return <ErrorComponent message="Error en datos del contrato" />;
        }

        // Renderizar formulario
        return (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                <ReciboFormDynamic contrato={parsed.data} recibo={recibo} />
            </div>
        );

    } catch (error) {
        // Log del error pero no arrojar excepción que pueda afectar la sesión
        console.error("Error en ReciboForm:", error);
        
        // Retornar error suave en lugar de throw
        return (
            <ErrorComponent 
                message="Error interno del servidor. Por favor, recarga la página." 
                title="Error Temporal"
            />
        );
    }
}
