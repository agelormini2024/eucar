"use client";
import { ClienteSchema } from "@/src/schema";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useClienteFormStore } from "@/src/stores/storeClientes";
import { updateCliente } from "@/actions/update-cliente-action";
import { useEffect } from "react";

export default function EditClienteForm({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { resetForm } = useClienteFormStore()
    const params = useParams();
    const id  = +params.id! // Asegúrate de que params sea awaited si es necesario

    useEffect(() => {
        return () => {
            resetForm(); // Limpia el estado global al desmontar el componente
        };
    }, [resetForm]);

    const handleSubmit = async (formData: FormData) => {
        const data = {
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            razonSocial: formData.get('razonSocial'),
            cuit: formData.get('cuit'),
            celular: formData.get('celular'),
            telefono1: formData.get('telefono1'),
            telefono2: formData.get('telefono2'),
            calle: formData.get('calle'),
            numero: Number(formData.get('numero')),
            piso: formData.get('piso'),
            departamento: formData.get('departamento'),
            codigoPostal: formData.get('codigoPostal'),
            localidad: formData.get('localidad'),
            provinciaId: Number(formData.get('provinciaId')),
            paisId: 1, //Number(formData.get('paisId')),
            email: formData.get('email'),
            observaciones: formData.get('observaciones'),
            activo: formData.get('activo') === 'on' ? true : false,

        }
        const result = ClienteSchema.safeParse(data)


        if (!result.success) {
            result.error.issues.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }

        const response = await updateCliente(result.data, id)

        if (response?.errors) {
            response.errors.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        toast.success("Se guardaron los cambios correctamente")
        resetForm() // Reiniciar el formulario después de guardar los cambios
        router.push('/admin/clientes/list')

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
