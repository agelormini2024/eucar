import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ItemRecibo = {
    descripcion: string
    monto: number
}

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
        montoPagado: number
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
        tipoIndice: string
        mesesRestaActualizar: number
        items: ItemRecibo[]
    }
    setFormValues: (values: Partial<RecibosFormState['formValues']>) => void
    addItem: () => void
    removeItem: (index: number) => void
    updateItem: (index: number, item: ItemRecibo) => void
    resetForm: () => {
        contratoId: number
        estadoReciboId: number
        fechaPendiente: string
        fechaGenerado: string
        fechaImpreso: string
        fechaAnulado: string
        montoAnterior: number
        montoTotal: number
        montoPagado: number
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
        tipoIndice: string
        mesesRestaActualizar: number
        items: ItemRecibo[]
    }
    setHabilitarBoton: (opc: boolean) => void
}

const useRecibosFormStore = create<RecibosFormState>()(
    devtools((set) => ({
        formValues: {
            contratoId: 0,
            estadoReciboId: 1, // 1 = Pendiente
            fechaPendiente: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
            fechaGenerado: "",
            fechaImpreso: "",
            fechaAnulado: "",
            montoAnterior: 0,
            montoTotal: 0,
            montoPagado: 0,
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
            habilitarBoton: false,
            tipoIndice: "",
            mesesRestaActualizar: 0,
            items: [{ descripcion: "Alquiler", monto: 0 }] // Ítem inicial del alquiler
        },
        setFormValues: (values) => set((state) => {
            const newFormValues = { ...state.formValues, ...values };
            const isEqual = Object.entries(newFormValues).every(
                ([key, value]) => state.formValues[key as keyof typeof state.formValues] === value
            );
            if (isEqual) return {};
            return { formValues: newFormValues };
        }),
        addItem: () => set((state) => ({
            formValues: {
                ...state.formValues,
                items: [...state.formValues.items, { descripcion: "", monto: 0 }]
            }
        })),
        removeItem: (index) => set((state) => ({
            formValues: {
                ...state.formValues,
                items: state.formValues.items.filter((_, i) => i !== index)
            }
        })),
        updateItem: (index, item) => set((state) => ({
            formValues: {
                ...state.formValues,
                items: state.formValues.items.map((existingItem, i) => 
                    i === index ? item : existingItem
                )
            }
        })),
        // setFormValues: (values) => set((state) => ({
        //     formValues: {
        //         ...state.formValues,
        //         ...values
        //     }
        // })),
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
                montoPagado: 0,
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
                habilitarBoton: false,
                tipoIndice: "",
                mesesRestaActualizar: 0,
                items: [{ descripcion: "Alquiler", monto: 0 }] // Ítem inicial del alquiler
            }
        })),
        setHabilitarBoton: (opc) => set((state) => ({
            formValues: {
                ...state.formValues,
                habilitarBoton: opc
            }

        }))


    })))

export default useRecibosFormStore;

