import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type RecibosFormState = {
    formValues: {
        contratoId: number
    }
    setFormValues: (values: Partial<RecibosFormState['formValues']>) => void
}

const useRecibosFormStore = create<RecibosFormState>()(
    devtools((set, get) => ({
        formValues: {
            contratoId: 0,
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

