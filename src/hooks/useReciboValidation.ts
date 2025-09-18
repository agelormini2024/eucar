import { useEffect, useState } from 'react'
import { calculaImporteRecibo } from '@/src/lib/calculaImporteRecibo'
import { verificaIpcActual } from '@/src/lib/verificaIpcActual'
import { Contrato } from '@/src/schema'
import useRecibosFormStore from '@/src/stores/storeRecibos'

/**
 * Custom hook para manejar validaciones del recibo
 * Incluye validación de IPC, cálculo de montos y habilitación de botones
 */
export function useReciboValidation(contrato: Contrato) {
    const [selectContrato, setSelectContrato] = useState<Contrato>()
    
    const formValues = useRecibosFormStore((state) => state.formValues)
    const setFormValues = useRecibosFormStore((state) => state.setFormValues)
    const setHabilitarBoton = useRecibosFormStore((state) => state.setHabilitarBoton)

    // Actualizar selectContrato cuando cambie el contrato
    useEffect(() => {
        setSelectContrato(contrato);
    }, [contrato]);

    // Validación de mes habilitado e IPC
    useEffect(() => {
        async function checkMesHabilitado() {
            let mesHabilitado = true
            if (formValues.mesesRestaActualizar === 0 && formValues.tipoIndice === 'IPC') { 
                // TODO: verificar si es necesario tipoIndice ICL
                mesHabilitado = await verificaIpcActual(formValues.fechaPendiente)
            }
            if (mesHabilitado) {
                const { montoCalculado } = calculaImporteRecibo(contrato)  // Calcular el importe del Recibo
                setFormValues({
                    montoTotal: montoCalculado,
                })
            } else {
                setFormValues({
                    montoTotal: 0,      // Seteamos el "estado" como PENDIENTE porque todavía no está el IPC correspondiente al mes a cobrar 
                    estadoReciboId: 1   // PENDIENTE
                })
            }
        }

        checkMesHabilitado();
    }, [formValues.tipoIndice, formValues.mesesRestaActualizar, formValues.fechaPendiente, contrato, setFormValues]);

    // Validación para permitir la GENERACION del Recibo
    useEffect(() => {
        if (!selectContrato) return;
        
        const serviciosIguales = (
            selectContrato.abl === formValues.abl &&
            selectContrato.aysa === formValues.aysa &&
            selectContrato.expensas === formValues.expensas &&
            selectContrato.luz === formValues.luz &&
            selectContrato.gas === formValues.gas &&
            selectContrato.otros === formValues.otros
        );

        setHabilitarBoton(serviciosIguales);
        
    }, [
        selectContrato,
        formValues.abl,
        formValues.aysa,
        formValues.expensas,
        formValues.luz,
        formValues.gas,
        formValues.otros,
        setHabilitarBoton
    ]);

    return {
        selectContrato,
        // Si necesitamos exponer más estado en el futuro
    }
}