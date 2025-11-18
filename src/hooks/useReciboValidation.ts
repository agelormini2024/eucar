import { useEffect, useState } from 'react'
import { calculaImporteRecibo } from '@/src/lib/calculaImporteRecibo'
import { verificaIpcActual } from '@/src/lib/verificaIpcActual'
import { Contrato } from '@/src/schema'
import useRecibosFormStore from '@/src/stores/storeRecibos'
import { RecibosConRelaciones } from '../types'
import { esItemAlquiler } from '@/src/utils/itemHelpers'

// ID del tipo de item ALQUILER en la base de datos
const TIPO_ITEM_ALQUILER_ID = 1

/**
 * Custom hook para manejar validaciones del recibo
 * Incluye validación de IPC, cálculo de montos y habilitación de botones
 * @param readOnly - Si es true, no recalcula montos (modo view)
 */
export function useReciboValidation(contrato: Contrato, recibo?: RecibosConRelaciones | null, readOnly?: boolean) {
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
            // Si es readOnly (modo view), NO recalcular nada - mostrar datos tal cual están guardados
            if (readOnly) {
                return;
            }
            
            // Solo calcular y pre-cargar ítem si NO hay recibo existente O si es PENDIENTE
            // Si el recibo existe pero NO es PENDIENTE (GENERADO, PAGADO, IMPRESO, ANULADO),
            // los datos ya están finalizados y no deben recalcularse
            if (recibo && recibo.id && recibo.estadoReciboId !== 1) {
                // Recibo existe y NO es PENDIENTE - datos ya finalizados
                // console.log('🔵 useReciboValidation: Recibo NO es PENDIENTE, saltando recálculo');
                return;
            }
            
            // console.log('🟢 useReciboValidation: Ejecutando recálculo...', {
            //     reciboId: recibo?.id,
            //     estadoRecibo: recibo?.estadoReciboId,
            //     mesesRestaActualizar: formValues.mesesRestaActualizar,
            //     tipoIndice: formValues.tipoIndice,
            //     fechaPendiente: formValues.fechaPendiente
            // });
            
            // Si llegamos aquí: recibo nuevo O recibo PENDIENTE (necesita verificar índices)
            // Calcular monto anterior por si lo necesitamos
            const montoAnterior = contrato.montoAlquilerUltimo === 0
                ? contrato.montoAlquilerInicial
                : contrato.montoAlquilerUltimo;
            
            // Verificar si le corresponde actualización por índice
            if (formValues.mesesRestaActualizar === 0) {
                // SÍ le corresponde actualización - verificar si hay índices disponibles
                let indicesDisponibles = true;
                
                if (formValues.tipoIndice === 'IPC') {
                    // TODO: verificar si es necesario tipoIndice ICL
                    indicesDisponibles = await verificaIpcActual(formValues.fechaPendiente);
                    // console.log('📊 Verificación IPC:', { indicesDisponibles, fechaPendiente: formValues.fechaPendiente });
                }
                
                if (indicesDisponibles) {
                    // Caso 1A: Corresponde actualización Y hay índices
                    const { montoCalculado } = calculaImporteRecibo(contrato);
                    // console.log('✅ Caso 1A: Calculando con índices', { montoCalculado });
                    
                    // Si hay items cargados (regeneración), actualizar solo el monto del "Alquiler"
                    // Si no hay items (nuevo recibo), crear el array con el item "Alquiler"
                    let itemsActualizados;
                    if (formValues.items.length > 0) {
                        // Regeneración: actualizar solo el monto del item "Alquiler", mantener los demás
                        const tieneAlquiler = formValues.items.some(item => esItemAlquiler(item));
                        if (tieneAlquiler) {
                            itemsActualizados = formValues.items.map(item => 
                                esItemAlquiler(item)
                                    ? { ...item, monto: montoCalculado }
                                    : item
                            );
                        } else {
                            // Si no tiene item "Alquiler", agregarlo al inicio
                            itemsActualizados = [
                                { descripcion: "Alquiler", monto: montoCalculado, tipoItemId: TIPO_ITEM_ALQUILER_ID },
                                ...formValues.items
                            ];
                        }
                    } else {
                        // Nuevo recibo: crear array con item "Alquiler"
                        itemsActualizados = [{ descripcion: "Alquiler", monto: montoCalculado, tipoItemId: TIPO_ITEM_ALQUILER_ID }];
                    }
                    
                    setFormValues({
                        montoTotal: montoCalculado,
                        estadoReciboId: 2, // GENERADO
                        items: itemsActualizados
                    });
                } else {
                    // Caso 1C: Corresponde actualización PERO NO hay índices
                    // console.log('⏳ Caso 1C: Sin índices, usando monto anterior', { montoAnterior });
                    
                    // Si hay items cargados, actualizar solo el monto del "Alquiler"
                    // Si no hay items, crear el array con el item "Alquiler"
                    let itemsActualizados;
                    if (formValues.items.length > 0) {
                        const tieneAlquiler = formValues.items.some(item => esItemAlquiler(item));
                        if (tieneAlquiler) {
                            itemsActualizados = formValues.items.map(item => 
                                esItemAlquiler(item)
                                    ? { ...item, monto: montoAnterior }
                                    : item
                            );
                        } else {
                            itemsActualizados = [
                                { descripcion: "Alquiler", monto: montoAnterior, tipoItemId: TIPO_ITEM_ALQUILER_ID },
                                ...formValues.items
                            ];
                        }
                    } else {
                        itemsActualizados = [{ descripcion: "Alquiler", monto: montoAnterior, tipoItemId: TIPO_ITEM_ALQUILER_ID }];
                    }
                    
                    setFormValues({
                        montoTotal: montoAnterior,
                        estadoReciboId: 1, // PENDIENTE
                        items: itemsActualizados
                    });
                }
            } else {
                // Caso 1B: NO le corresponde actualización - usar monto anterior directamente
                // console.log('📋 Caso 1B: No corresponde actualización', { montoAnterior });
                
                // Si hay items cargados, actualizar solo el monto del "Alquiler"
                // Si no hay items, crear el array con el item "Alquiler"
                let itemsActualizados;
                if (formValues.items.length > 0) {
                    const tieneAlquiler = formValues.items.some(item => esItemAlquiler(item));
                    if (tieneAlquiler) {
                        itemsActualizados = formValues.items.map(item => 
                            esItemAlquiler(item)
                                ? { ...item, monto: montoAnterior }
                                : item
                        );
                    } else {
                        itemsActualizados = [
                            { descripcion: "Alquiler", monto: montoAnterior, tipoItemId: TIPO_ITEM_ALQUILER_ID },
                            ...formValues.items
                        ];
                    }
                } else {
                    itemsActualizados = [{ descripcion: "Alquiler", monto: montoAnterior, tipoItemId: TIPO_ITEM_ALQUILER_ID }];
                }
                
                setFormValues({
                    montoTotal: montoAnterior,
                    estadoReciboId: 2, // GENERADO (no está pendiente, simplemente no actualiza)
                    items: itemsActualizados
                });
            }
        }

        checkMesHabilitado();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues.tipoIndice, formValues.mesesRestaActualizar, formValues.fechaPendiente, contrato, setFormValues, recibo]);
    // Nota: formValues.items se lee dentro del effect pero NO se incluye en dependencias
    // para evitar loop infinito, ya que el effect modifica items

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