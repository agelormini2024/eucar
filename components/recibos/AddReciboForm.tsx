"use client"
import { ReciboSchema } from "@/src/schema";
import useRecibosFormStore from "@/src/stores/storeRecibos";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const handleSubmit = async (formData: FormData) => {
    // Aquí puedes manejar el envío del formulario

}
export default function AddReciboForm({ children }: { children: React.ReactNode }) {

    const router = useRouter()
    const formValues = useRecibosFormStore((state) => state.formValues)

    const handleSubmit = (formData: FormData) => {
        // Creamos un objeto "data" para guardar los 
        // datos ingresados extrayendolos de FormData
        const data = {
            contratoId: Number(formData.get('contratoId'))
        }

        const result = ReciboSchema.safeParse(data)
        if (!result.success) {
            result.error.issues.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        
        toast.success("Recibo Generado correctamente")
        router.push('/admin/recibos/alta')

        //-------------------- Aqui generar el recibo -------------------


        //---------------------------------------------------------------

    }




    return (
        <div className='bg-white shadow-xl mt-10 px-5 py-10 rounded-md max-w-5xl mx-auto'>
            <form
                className="space-y-5"
                onSubmit={(e) => {
                    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario                
                    const formData = new FormData(e.currentTarget); // Obtener los datos del formulario
                    handleSubmit(formData); // Llamar a la función de envío
                }}
            >
                {children}

                <input
                    type="submit"
                    className='bg-red-800 hover:bg-red-600 text-white p-3 rounded-md w-full 
                    cursor-pointer font-bold uppercase mt-5'
                    value="Generar Recibo"
                />
            </form>
        </div>

    )
}
