import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type PropiedadFormState = {
    formValues: {
        descripcion: string;
        calle: string;
        numero: number;
        piso: string;
        departamento: string;
        localidad: string;
        provinciaId: number;
        paisId: number;
        codigoPostal: string;
        ambientes: number;
        dormitorios: number;
        banios: number;
        metrosCuadrados: number;
        metrosCubiertos: number;
        cochera: number;
        expensas: number;
        antiguedad: number;
        imagen: string;
        tipoPropiedadId: number;
        observaciones: string,
        clienteId: number;
        activo: boolean;

    },
    setFormValues: (values: Partial<PropiedadFormState['formValues']>) => void;
    resetForm: () => void;
}

export const usePropiedadFormStore = create<PropiedadFormState>()(
    devtools((set) => ({
        formValues: {
            descripcion: '',
            calle: '',
            numero: 0,
            piso: '',
            departamento: '',
            localidad: '',
            provinciaId: 0,
            paisId: 1,
            codigoPostal: '',
            ambientes: 0,
            dormitorios: 0,
            banios: 0,
            metrosCuadrados: 0,
            metrosCubiertos: 0,
            cochera: 0,
            expensas: 0,
            antiguedad: 0,
            imagen: '',
            tipoPropiedadId: 0,
            observaciones: '',
            clienteId: 0,
            activo: true,
        },
        setFormValues: values => set((state) => ({
            formValues: {
                ...state.formValues,
                ...values
            }
        })),
        resetForm: () => set(() => ({
            formValues: {
                descripcion: '',
                calle: '',
                numero: 0,
                piso: '',
                departamento: '',
                localidad: '',
                provinciaId: 0,
                paisId: 1,
                codigoPostal: '',
                ambientes: 0,
                dormitorios: 0,
                banios: 0,
                metrosCuadrados: 0,
                metrosCubiertos: 0,
                cochera: 0,
                expensas: 0,
                antiguedad: 0,
                imagen: '',
                tipoPropiedadId: 0,
                observaciones: '',
                clienteId: 0,
                activo: true,
            }
        })),
    }))
)