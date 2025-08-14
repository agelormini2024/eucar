"use client"
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useContratoFormStore } from "@/src/stores/storeContratos";
import { ContratoSchema } from "@/src/schema";
import { createContrato } from "@/actions/create-contrato-action";


export default function AddContratoForm({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { resetForm, formValues } = useContratoFormStore()

    console.log("Valores del formulario:", formValues)
    
    const handleSubmit = async (formData: FormData) => {
        // Creamos un objeto "data" para guardar los 
        // datos ingresados extrayendolos de FormData
        const data = {
            descripcion: formData.get('descripcion'),
            fechaInicio: formData.get('fechaInicio'),
            fechaVencimiento: formData.get('fechaVencimiento'),
            cantidadMesesDuracion: Number(formValues.cantidadMesesDuracion), // Valores tomados del estado global "storeContratos"
            mesesRestaActualizar: Number(formValues.mesesRestaActualizar), // Valores tomados del estado global "storeContratos"
            diaMesVencimiento: Number(formValues.diaMesVencimiento), // Valores tomados del estado global "storeContratos"
            clienteIdPropietario: formValues.clienteIdPropietario,
            clienteIdInquilino: Number(formValues.clienteIdInquilino), // Cambiado para tomar del store
            propiedadId: Number(formValues.propiedadId), // Cambiado para tomar del store
            tipoContratoId: Number(formData.get('tipoContratoId')),
            tipoIndiceId: Number(formData.get('tipoIndiceId')),
            montoAlquilerInicial: Number(formData.get('montoAlquilerInicial')),
            observaciones: formData.get('observaciones'),
            expensas: formData.get('expensas') === "on",
            abl: formData.get('abl') === "on",
            aysa: formData.get('aysa') === "on",
            luz: formData.get('luz') === "on",
            gas: formData.get('gas') === "on",
            otros: formData.get('otros') === "on"
        }

        // Validar los datos con el esquema de contrato de Zod
        const result = ContratoSchema.safeParse(data)

        if (!result.success) {
            result.error.issues.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        // Crear el contrato
        const response = await createContrato(result.data)

        if (response?.errors) {
            response.errors.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        toast.success("Contrato creado correctamente")
        router.push('/admin/contratos/alta')

        // Limpiar el formulario
        resetForm()

    };

    return (
        <div className='bg-white shadow-xl mt-10 px-5 py-10 rounded-md max-w-5xl mx-auto'>
            <form
                className="space-y-5"
                onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget); // Obtener los datos del formulario
                    handleSubmit(formData)
                }}
            >
                {children}

                <input
                    type="submit"
                    className='bg-red-800 hover:bg-red-600 text-white p-3 rounded-md w-full 
                    cursor-pointer font-bold uppercase mt-5'
                    value="Crear Contrato"
                />
            </form>
        </div>
    )
}
