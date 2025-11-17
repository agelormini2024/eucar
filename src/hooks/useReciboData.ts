import { useEffect } from 'react'
import { Contrato, EstadoReciboSchema } from '@/src/schema'
import useRecibosFormStore from '@/src/stores/storeRecibos'
// import { Recibo } from '@prisma/client'
import { formatDateForInput, formatPropiedadAddress, formatFullName } from '@/src/utils/recibo/formatters'
import { RecibosConRelaciones } from '../types'

/**
 * Custom hook para manejar la carga de datos del recibo
 * Maneja tanto la carga inicial del contrato como la carga de recibos existentes
 */
export function useReciboData(contrato: Contrato, recibo?: RecibosConRelaciones | null) {
    const setFormValues = useRecibosFormStore((state) => state.setFormValues)

    // Función para cargar datos del contrato
    const cargarContrato = async () => {
        const montoAlquiler = contrato.montoAlquilerUltimo === 0
            ? contrato.montoAlquilerInicial
            : contrato.montoAlquilerUltimo;

        setFormValues({
            expensas: false,
            abl: false,
            luz: false,
            gas: false,
            aysa: false,
            otros: false,
            contratoId: contrato.id,
            montoAnterior: montoAlquiler,
            tipoContratoId: contrato.tipoContratoId,
            tipoContrato: contrato.tipoContrato.descripcion,
            clientePropietario: formatFullName(contrato.clientePropietario.apellido, contrato.clientePropietario.nombre),
            clienteInquilino: formatFullName(contrato.clienteInquilino.apellido, contrato.clienteInquilino.nombre),
            propiedad: formatPropiedadAddress(contrato.propiedad),
            tipoIndice: contrato.tipoIndice.nombre,
            mesesRestaActualizar: contrato.mesesRestaActualizar,
            // NO crear ítems automáticamente - useReciboValidation se encarga de eso
        });
    }

    // Función para cargar estado del recibo
    const cargarEstadoRecibo = async (estadoReciboId: number) => {
        if (!estadoReciboId) return;
        try {
            const result = await fetch(`/api/recibos/estadoRecibo/${estadoReciboId}`).then(res => res.json())
            const { data: estadoRecibo } = EstadoReciboSchema.safeParse(result)
            if (estadoRecibo) {
                setFormValues({ estadoRecibo: estadoRecibo.descripcion })
            } else {
                console.log('No se encontró el Estado para el recibo !!!')
            }
        } catch (error) {
            console.error('Error al cargar estado del recibo:', error)
        }
    }

    // Función para cargar datos de recibo existente
    const cargarReciboExistente = async () => {
        if (!recibo) return

        const estadoReciboId = recibo.estadoReciboId || 1;

        setFormValues({
            contratoId: recibo.contratoId || contrato.id,
            estadoReciboId: estadoReciboId,
            estadoRecibo: recibo.estadoRecibo?.descripcion || '', // <-- agrega esto si tienes la relación
            fechaPendiente: formatDateForInput(recibo.fechaPendiente),
            fechaGenerado: formatDateForInput(recibo.fechaGenerado),
            fechaImpreso: formatDateForInput(recibo.fechaImpreso),
            fechaAnulado: formatDateForInput(recibo.fechaAnulado),
            montoAnterior: recibo.montoAnterior || 0,
            montoTotal: recibo.montoTotal || 0,
            montoPagado: recibo.montoPagado || 0,
            abl: recibo.abl || false,
            aysa: recibo.aysa || false,
            luz: recibo.luz || false,
            gas: recibo.gas || false,
            otros: recibo.otros || false,
            expensas: recibo.expensas || false,
            observaciones: recibo.observaciones || ''
        })

        // Cargar el estado del recibo con el ID correcto
        await cargarEstadoRecibo(estadoReciboId);

        // Cargar ítems existentes del recibo
        fetch(`/api/recibos/items/${recibo.id}`)
            .then(res => res.json())
            .then(itemsExistentes => {
                if (itemsExistentes && itemsExistentes.length > 0) {
                    // Cargar TODOS los items tal cual están en la BD
                    // Esto incluye el item "Alquiler" que ya tiene el monto correcto guardado
                    setFormValues({ items: itemsExistentes });
                }
            })
            .catch(error => {
                console.error("Error al cargar ítems del recibo:", error)
                // Si hay error, mantener el ítem por defecto que ya está en el store
            })
    }

    // Effect para cargar datos del contrato
    useEffect(() => {
        // Siempre cargar datos del contrato (propiedad, propietario, etc.)
        cargarContrato();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contrato, recibo]);

    // Effect para cargar datos del recibo existente y estado
    useEffect(() => {
        cargarReciboExistente()
        // Solo cargar estado por defecto si NO hay recibo (nuevo recibo)
        if (!recibo) {
            cargarEstadoRecibo(1) // Estado PENDIENTE por defecto para recibos nuevos
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recibo, contrato.id])

    return {
        // Si necesitamos exponer algún estado o función en el futuro
    }
}