"use client"
import { createRecibo } from "@/actions/create-recibo-action";
import { ReciboSchema } from "@/src/schema";
import useRecibosFormStore from "@/src/stores/storeRecibos";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AddReciboForm({ children }: { children: React.ReactNode }) {

    const router = useRouter()
    const formValues = useRecibosFormStore((state) => state.formValues)
    // const resetForm = useRecibosFormStore((state) => state.resetForm)

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

            /**-------------------- Aqui generar el recibo -------------------*/
            const response = await createRecibo(result.data);

            // Verificar que recibimos una respuesta
            if (!response) {
                toast.error("Error de conexión al generar el recibo");
                return;
            }

            if (!response.success) {
                // Mostrar errores específicos si existen
                if (response.errors && response.errors.length > 0) {
                    response.errors.forEach(error => {
                        const message = error.message || "Error desconocido";
                        toast.error(message);
                    });
                } else {
                    toast.error("Error inesperado al generar el recibo");
                }
                return;
            }

            // Éxito confirmado - proceder con navegación
            toast.success("Recibo generado correctamente");
            router.push('/admin/contratos/list?toast=success');
            /**--------------------------------------------------------------*/

        } catch (error) {
            console.error("Error inesperado en handleSubmit:", error);
            toast.error("Error inesperado. Por favor, intenta nuevamente.");
        }
    };

    return (
        <div className='bg-white shadow-xl mt-10 px-5 py-10 rounded-md max-w-5xl mx-auto'>
            <form
                className="space-y-5"
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget); // Obtener los datos del formulario
                    handleSubmit(formData); // Llamar a la función de envío
                }}
            >
                {children}
                <div className="flex flex-col md:flex-row gap-2 md:gap-5 mt-10">
                    <input
                        type="submit"
                        className='bg-red-800 hover:bg-red-600 text-white p-3 rounded-md w-full 
                    cursor-pointer font-bold uppercase mt-5 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        value="G e n e r a r     R e c i b o"
                        disabled={!formValues.habilitarBoton}
                    />
                    <input
                        type="button"
                        className='bg-slate-800 hover:bg-slate-600 text-white p-3 rounded-md w-full 
                    cursor-pointer font-bold uppercase mt-5 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        value="Cancelar Generación"
                        onClick={() => router.push('/admin/contratos/list')}
                    />
                </div>
            </form>
        </div>

    )
}
