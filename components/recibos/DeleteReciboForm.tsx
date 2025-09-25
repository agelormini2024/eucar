"use client"
import { deleteRecibo } from "@/actions/delete-recibo-action"
import { ReciboSchema } from "@/src/schema"
import useRecibosFormStore from "@/src/stores/storeRecibos"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "react-toastify"

export default function DeleteReciboForm({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { resetForm, formValues } = useRecibosFormStore()
    const params = useParams()
    const id = +params.id!

    useEffect(() => {
        return () => {
            resetForm();
        }
    }, [resetForm]);

    const handleSubmit = async (formData: FormData) => {
        try {
            // 1. Preparar datos del formulario combinando formValues y FormData
            const data = {
                contratoId: formValues.contratoId,
                estadoReciboId: Number(formValues.estadoReciboId),
                fechaPendiente: formValues.fechaPendiente,
                fechaGenerado: formValues.fechaGenerado,
                fechaImpreso: formValues.fechaImpreso,
                fechaAnulado: formValues.fechaAnulado,
                montoAnterior: formValues.montoAnterior,
                montoTotal: formValues.montoTotal,
                montoPagado: formValues.montoPagado,
                observaciones: formData.get('observaciones'),
                expensas: formData.get('expensas') === "on",
                abl: formData.get('abl') === "on",
                aysa: formData.get('aysa') === "on",
                luz: formData.get('luz') === "on",
                gas: formData.get('gas') === "on",
                otros: formData.get('otros') === "on",
                items: formValues.items // Incluir los ítems del recibo
            };

            // 2. Validar datos con Zod
            const result = ReciboSchema.safeParse(data); // Validar con Zod

            if (!result.success) {
                // Mostrar errores de validación específicos
                result.error.issues.forEach(issue => {
                    const fieldName = issue.path.length > 0 ? issue.path.join('.') : 'Campo';
                    toast.error(`${fieldName}: ${issue.message}`);
                });
                return;
            }

            /**-------------------- Aqui borrar el recibo -------------------*/
            const response = await deleteRecibo(id, result.data);

            // Verificar que recibimos una respuesta
            if (!response) {
                toast.error("Error de conexión al eliminar el recibo");
                return;
            }

            if (!response.success) {        
                toast.error(` Error al eliminar el recibo: ${response.errors!.map(e => e.message).join(', ')}`);
                return;
            }

            toast.success("Recibo eliminado !!!");
            router.push('/admin/recibos/list') // Redirigir a la lista de recibos

        } catch (error) {
            console.error("Error al eliminar el recibo:", error);
            toast.error("Error inesperado al eliminar el recibo");
        }
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
                    value="Eliminar Recibo !!!"
                    disabled={!formValues.habilitarBoton}
                />
            </form>
        </div>
    )
}
