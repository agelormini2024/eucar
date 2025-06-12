import { estadoRecibo } from '@/prisma/data/estadoRecibo';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type RecibosFormState = {
    formValues: {
        contratoId: number
        estadoReciboId: number
        fechaPendiente: string
        fechaGenerado: string
        fechaImpreso: string
        fechaAnulado: string
        montoAnterior: number
        montoTotal: number
        abl: boolean
        aysa: boolean
        luz: boolean
        gas: boolean
        expensas: boolean
        otros: boolean
        observaciones: string
        propiedad: string
        tipoContratoId: number
        tipoContrato: string
        clientePropietario: string
        clienteInquilino: string
        estadoRecibo: string
        habilitarBoton: boolean
    }
    setFormValues: (values: Partial<RecibosFormState['formValues']>) => void
    resetForm: () => {
        contratoId: number
        estadoReciboId: number
        fechaPendiente: string
        fechaGenerado: string
        fechaImpreso: string
        fechaAnulado: string
        montoAnterior: number
        montoTotal: number
        abl: boolean
        aysa: boolean
        luz: boolean
        gas: boolean
        expensas: boolean
        otros: boolean
        observaciones: string
        propiedad: string
        tipoContratoId: number
        tipoContrato: string
        clientePropietario: string
        clienteInquilino: string
        estadoRecibo: string
        habilitarBoton: boolean
    }
    setHabilitarBoton: (opc: boolean) => void
}

const useRecibosFormStore = create<RecibosFormState>()(
    devtools((set, get) => ({
        formValues: {
            contratoId: 0,
            estadoReciboId: 1, // 1 = Pendiente
            fechaPendiente: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
            fechaGenerado: "",
            fechaImpreso: "",
            fechaAnulado: "",
            montoAnterior: 0,
            montoTotal: 0,
            abl: false,
            aysa: false,
            luz: false,
            gas: false,
            expensas: false,
            otros: false,
            observaciones: "",
            propiedad: "",
            tipoContratoId: 0,
            tipoContrato: "",
            clientePropietario: "",
            clienteInquilino: "",
            estadoRecibo: "",
            habilitarBoton: false
        },
        setFormValues: (values) => set((state) => ({
            formValues: {
                ...state.formValues,
                ...values
            }
        })),
        resetForm: () => set(() => ({
            formValues: {
                contratoId: 0,
                estadoReciboId: 1, // 1 = Pendiente
                fechaPendiente: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
                fechaGenerado: "",
                fechaImpreso: "",
                fechaAnulado: "",
                montoAnterior: 0,
                montoTotal: 0,
                abl: false,
                aysa: false,
                luz: false,
                gas: false,
                expensas: false,
                otros: false,
                observaciones: "",
                propiedad: "",
                tipoContratoId: 0,
                tipoContrato: "",
                clientePropietario: "",
                clienteInquilino: "",
                estadoRecibo: "",
                habilitarBoton: false
            }
        })),
        setHabilitarBoton: (opc)=> set((state) => ({
                formValues: {
                ...state.formValues,
                habilitarBoton: opc
            }
        
        }))


    })))

export default useRecibosFormStore;

