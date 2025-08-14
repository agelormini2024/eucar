"use client"
import { updateContrato } from "@/actions/update-contrato-action"
import { ContratoSchema } from "@/src/schema"
import { useContratoFormStore } from "@/src/stores/storeContratos"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "react-toastify"


export default function EditContratoForm({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { resetForm, formValues } = useContratoFormStore()
    const params = useParams()
    const id = +params.id!

    console.log("EditContratoForm - formValues:", formValues);

    useEffect(() => {
        console.log("EditContratoForm montado");
        return () => {
            console.log("EditContratoForm desmontado");
            resetForm();
        }
    }, [resetForm]);

    useEffect(() => {
        console.log("EditContratoForm montado");
    }, []);


    const handleSubmit = async (formData: FormData) => {
        const data = {
            descripcion: formData.get('descripcion'),
            fechaInicio: formData.get('fechaInicio'),
            fechaVencimiento: formData.get('fechaVencimiento'),
            cantidadMesesDuracion: Number(formValues.cantidadMesesDuracion),
            mesesRestaActualizar: Number(formValues.mesesRestaActualizar),
            diaMesVencimiento: Number(formValues.diaMesVencimiento),
            clienteIdPropietario: formValues.clienteIdPropietario,
            clienteIdInquilino: Number(formData.get('clienteIdInquilino')),
            propiedadId: Number(formValues.propiedadId), // Cambiado para tomar del store
            tipoContratoId: Number(formData.get('tipoContratoId')),
            tipoIndiceId: Number(formData.get('tipoIndiceId')),
            montoAlquilerInicial: Number(formData.get('montoAlquilerInicial')),
            observaciones: formData.get('observaciones'),
            expensas: formData.get('expensas') === "on" ? true : false,
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

        const response = await updateContrato(result.data, id)

        if (response?.errors) {
            response.errors.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        toast.success("Los datos se guardaron correctamente")
        resetForm() // Reiniciar el formulario después de guardar los cambios
        router.push('/admin/contratos/list')

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
                    value="Guardar Cambios"
                />
            </form>
        </div>
    )
}
