import { Contrato } from '@/src/schema'
import { RecibosFormState } from '@/src/stores/storeRecibos'
import { Recibo } from "@prisma/client";

/**
 * Tipos y utilidades relacionadas con recibos
 * @fileoverview Definiciones de tipos para formularios, relaciones y operaciones de recibos
 * @author Alejandro
 * @since 1.0.0
 */

/**
 * Valores del formulario de recibos extraídos del store de Zustand
 * @example
 * const formValues: ReciboFormValues = useRecibosFormStore(state => state.formValues)
 */
export type ReciboFormValues = RecibosFormState['formValues']

/**
 * Props para componentes de formulario de recibos
 * @example
 * function ReciboHeader({ contrato, formValues, handleInputChange }: ReciboFormProps) {
 *   // implementación del componente
 * }
 */
export type ReciboFormProps = {
    contrato: Contrato
    formValues: ReciboFormValues
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

/**
 * Función setter para actualizar valores del formulario de recibos
 * @example
 * const setFormValues: ReciboFormSetValues = useRecibosFormStore(state => state.setFormValues)
 * setFormValues({ montoTotal: 1000 })
 */
export type ReciboFormSetValues = RecibosFormState['setFormValues']

/**
 * Tipo para recibos con todas sus relaciones de contrato
 * Incluye información del contrato, clientes, propiedad y estado del recibo
 * @example
 * const recibos: RecibosConRelaciones[] = await getRecibos()
 * console.log(recibos[0].contrato.clienteInquilino.nombre) // Nombre del inquilino
 */
export type RecibosConRelaciones = Recibo & {
    contrato: {
        mesesRestaActualizar: number,
        clienteInquilino: {
            nombre: string;
            apellido: string;
        },
        propiedad: {
            calle: string,
            numero: number,
            piso: string,
            departamento: string
        }
    }
    estadoRecibo: {
        descripcion: string;
    }
    fechaPendiente: Date;
    fechaGenerado: Date | null;
    montoAnterior: number;
    montoTotal: number;
}

/**
 * Tipo para un recibo individual con relaciones completas para impresión
 * Incluye toda la información necesaria para generar PDFs e imprimir recibos
 * @example
 * const recibo: ReciboConRelaciones = await getReciboParaImprimir(reciboId)
 * console.log(recibo.contrato.clientePropietario.nombre) // Nombre del propietario
 */
export type ReciboConRelaciones = {
    id: number;
    contratoId: number;
    estadoReciboId: number;
    fechaPendiente: string; // ISO string (Date serializado)
    fechaGenerado: string | null;
    fechaImpreso: string | null;
    fechaAnulado: string | null;
    montoAnterior: number;
    montoTotal: number;
    montoPagado: number;
    observaciones?: string | null;
    createdAt: string;
    updatedAt: string;
    expensas: boolean;
    abl: boolean;
    aysa: boolean;
    luz: boolean;
    gas: boolean;
    otros: boolean;
    itemsRecibo?: Array<{
        id: number;
        descripcion: string;
        monto: number;
        tipoItemId: number;
        observaciones?: string | null;
        tipoItem: {
            codigo: string;
            nombre: string;
        };
    }>;
    contrato: {
        clienteInquilino: {
            apellido: string;
            nombre: string;
            cuit: string;
        };
        clientePropietario: {
            apellido: string;
            nombre: string;
            cuit: string;
        };
        propiedad: {
            calle: string;
            numero: number;
            piso: string | null;
            departamento: string | null;
            tipoPropiedad?: {
                descripcion: string;
            };
        };
    };
};