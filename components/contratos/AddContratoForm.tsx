"use client"
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useContratoFormStore } from "@/src/stores/storeContratos";
import { ContratoSchema } from "@/src/schema";
import { createContrato } from "@/actions/create-contrato-action";


export default function AddContratoForm({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { resetForm } = useContratoFormStore()

    const handleSubmit = async (formData: FormData) => {
        // Aquí puedes manejar el envío del formulario
        // Por ejemplo, enviar los datos a una API o realizar alguna acción
        const data = {
            descripcion: formData.get('descripcion'),
            fechaInicio: formData.get('fechaInicio'),
            fechaVencimiento: formData.get('fechaVencimiento'),
            cantidadMesesDuracion: Number(formData.get('cantidadMesesDuracion')),
            diaMesVencimiento: Number(formData.get('diaMesVencimiento')),
            clienteIdPropietario: Number(formData.get('clienteIdPropietario')),
            clienteIdInquilino: Number(formData.get('clienteIdInquilino')),
            propiedadId: Number(formData.get('propiedadId')),
            tipoContratoId: Number(formData.get('tipoContratoId')),
            tipoIndiceId: Number(formData.get('tipoIndiceId')),
            expensas: formData.get('expensas'),
            abl: formData.get('abl'),
            aysa: formData.get('aysa'),
            luz: formData.get('luz'),
            gas: formData.get('gas'),
            otros: formData.get('otros')
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
                    value="Crear Contrato"
                />
            </form>
        </div>
    )
}
