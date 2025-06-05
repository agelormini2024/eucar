import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type RecibosFormState = {
    formValues: {
        contratoId: number
        estadoReciboId: number
        fechaPendiente: string
        fechaGenerado: string
        fechaImpreso: string
        fechaAnulado: string
        montoTotal: number
        abl: boolean
        aysa: boolean
        luz: boolean
        gas: boolean
        expensas: boolean
        otros: boolean
        observaciones: string
    }
    setFormValues: (values: Partial<RecibosFormState['formValues']>) => void
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
            montoTotal: 0,
            abl: false,
            aysa: false,
            luz: false,
            gas: false,
            expensas: false,
            otros: false,
            observaciones: ""

        },
        setFormValues: (values) => set((state) => ({
            formValues: {
                ...state.formValues,
                ...values
            }
        }))
    })
    ))

export default useRecibosFormStore;

