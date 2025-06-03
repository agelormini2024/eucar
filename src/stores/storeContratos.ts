import { create } from "zustand";
import { devtools } from "zustand/middleware";

type ContratoFormState = {
    formValues: {
        descripcion: string;
        fechaInicio: string;
        fechaVencimiento: string;
        cantidadMesesDuracion: number;
        mesesRestaActualizar: number;
        diaMesVencimiento: number;
        clienteIdPropietario: number;
        clienteIdInquilino: number;
        propiedadId: number;
        tipoContratoId: number;
        tipoIndiceId: number;
        montoAlquilerInicial: number;
        observaciones: string;
        expensas: boolean;
        abl: boolean;
        aysa: boolean;
        luz: boolean;
        gas: boolean;
        otros: boolean;
    },
    setFormValues: (values: Partial<ContratoFormState['formValues']>) => void;
    resetForm: () => void;
}
export const useContratoFormStore = create<ContratoFormState>()( 
    devtools((set) => ({
        formValues: {
            descripcion: '',
            fechaInicio: '',
            fechaVencimiento: '',
            cantidadMesesDuracion: 0,
            mesesRestaActualizar: 0,
            diaMesVencimiento: 10,
            clienteIdPropietario: 0,
            clienteIdInquilino: 0,
            propiedadId: 0,
            tipoContratoId: 0,
            tipoIndiceId: 0,
            montoAlquilerInicial: 0,
            observaciones: '',
            expensas: false,
            abl: false,
            aysa: false,
            luz: false,
            gas: false,
            otros: false
        },
        setFormValues: (values) => set((state) => ({
            formValues: {
                ...state.formValues,
                ...values
            }
        })),
        resetForm: () => set(() => ({
            formValues: {
                descripcion: '',
                fechaInicio: '',
                fechaVencimiento: '',
                cantidadMesesDuracion: 0,
                mesesRestaActualizar: 0,
                diaMesVencimiento: 0,
                clienteIdPropietario: 0,
                clienteIdInquilino: 0,
                propiedadId: 0,
                tipoContratoId: 0,
                tipoIndiceId: 0,
                montoAlquilerInicial: 0,
                observaciones: '',
                expensas: false,
                abl: false,
                aysa: false,
                luz: false,
                gas: false,
                otros: false
            }
        })),
    }))
) // Aquí se puede agregar un nombre para la extensión de Redux DevTools