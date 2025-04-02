import {create} from "zustand";

type ClienteFormState = {
    formValues: {
        nombre: string;
        apellido: string;
        razonSocial: string;
        cuit: string;
        celular: string;
        telefono1: string;
        telefono2: string;
        calle: string;
        numero: number;
        piso: string;
        departamento: string;
        codigoPostal: string;
        localidad: string;
        provinciaId: number;
        paisId: number;
        email: string;
        observaciones: string,
        activo: boolean;
    },
    setFormValues: (values: Partial<ClienteFormState['formValues']>) => void;
    resetForm: () => void;
}

export const useClienteFormStore = create<ClienteFormState>((set) => ({
    formValues: {
        nombre: '',
        apellido: '',
        razonSocial: '',
        cuit: '',
        celular: '',
        telefono1: '',
        telefono2: '', 
        calle: '',
        numero: 0,
        piso: '',
        departamento: '',
        codigoPostal: '',
        localidad: '',
        provinciaId: 0,
        paisId: 1,
        email: '',
        observaciones: '',
        activo: true,

    },
    setFormValues: (values) => set((state) => ({
        formValues: {
            ...state.formValues,
            ...values
        }
    })),
    resetForm: () => set(() => ({
        formValues: {
            nombre: '',
            apellido: '',
            razonSocial: '',
            cuit: '',
            celular: '',
            telefono1: '',
            telefono2: '',
            calle: '',
            numero: 0,
            piso: '',
            departamento: '',
            codigoPostal: '',
            localidad: '',
            provinciaId: 0,
            paisId: 1,
            email: '',
            observaciones: '',
            activo: true,

        }
    }))
}))

