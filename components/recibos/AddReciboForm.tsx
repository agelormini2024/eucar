"use client"
import { createRecibo } from "@/actions/create-recibo-action";
import { ReciboSchema } from "@/src/schema";
import useRecibosFormStore from "@/src/stores/storeRecibos";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AddReciboForm({ children }: { children: React.ReactNode }) {

    const router = useRouter()
    const formValues = useRecibosFormStore((state) => state.formValues)
    const resetForm = useRecibosFormStore((state) => state.resetForm)

    const handleSubmit = async (formData: FormData) => {
        // Creamos un objeto "data" para guardar los 
        // datos ingresados extrayendolos de FormData
        const data = {
            contratoId: formValues.contratoId,
            estadoReciboId: Number(formValues.estadoReciboId),
            fechaPendiente: formValues.fechaPendiente,
            fechaGenerado: formValues.fechaGenerado,
            fechaImpreso: formValues.fechaImpreso,
            fechaAnulado: formValues.fechaAnulado,
            montoAnterior: formValues.montoAnterior,
            montoTotal: formValues.montoTotal,
            observaciones: formData.get('observaciones'),
            expensas: formData.get('expensas') === "on",
            abl: formData.get('abl') === "on",
            aysa: formData.get('aysa') === "on",
            luz: formData.get('luz') === "on",
            gas: formData.get('gas') === "on",
            otros: formData.get('otros') === "on"

        }

        const result = ReciboSchema.safeParse(data)

        if (!result.success) {
            result.error.issues.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }

        /**-------------------- Aqui generar el recibo -------------------*/

        const response = await createRecibo(result.data)

        if (response?.errors){
            response.errors.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }

        toast.success("Recibo Generado correctamente")
        router.push('/admin/contratos/list?toast=success',  )
        // resetForm()
        /**--------------------------------------------------------------*/
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
                    cursor-pointer font-bold uppercase mt-5 disabled:bg-gray-400 disabled:cursor-not-allowed'
                    value="Generar Recibo"
                    disabled={!formValues.habilitarBoton}
                />
            </form>
        </div>

    )
}
