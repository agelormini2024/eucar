"use client"

import { updatePropiedad } from "@/actions/update-propiedad-action";
import { PropiedadSchema } from "@/src/schema";
import { usePropiedadFormStore } from "@/src/stores/storePropiedades";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";


export default function EditPropiedadForm({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { resetForm } = usePropiedadFormStore()
    const params = useParams();
    const id = +params.id! // Asegúrate de que params sea awaited si es necesario

    useEffect(() => {
        return () => {
            resetForm(); // Limpia el estado global al desmontar el componente
        };
    }, [resetForm]);


    const handleSubmit = async (formData: FormData) => {
        const data = {
            descripcion: formData.get('descripcion'),
            calle: formData.get('calle'),
            numero: Number(formData.get('numero')),
            piso: formData.get('piso'),
            departamento: formData.get('departamento'),
            localidad: formData.get('localidad'),
            provinciaId: Number(formData.get('provinciaId')),
            paisId: 1,
            codigoPostal: formData.get('codigoPostal'),
            ambientes: Number(formData.get('ambientes')),
            dormitorios: Number(formData.get('dormitorios')),
            banios: Number(formData.get('banios')),
            metrosCuadrados: Number(formData.get('metrosCuadrados')),
            metrosCubiertos: Number(formData.get('metrosCubiertos')),
            cochera: Number(formData.get('cochera')),
            expensas: Number(formData.get('expensas')),
            antiguedad: Number(formData.get('antiguedad')),
            imagen: '', //formData.get('imagen'),
            tipoPropiedadId: Number(formData.get('tipoPropiedadId')),
            observaciones: formData.get('observaciones'),
            clienteId: Number(formData.get('clienteId')),
            activo: formData.get('activo') === 'on' ? true : false,
        }
        // Validar el formulario
        const result = PropiedadSchema.safeParse(data)

        if (!result.success) {
            result.error.issues.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        // Llamar a la función de creación de propiedad en el create-propiedad-action.ts

        const response = await updatePropiedad(result.data, id)

        if (response?.errors) {
            response.errors.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        toast.success("Proiedad editada correctamente")
        router.push('/admin/propiedades/list')
        // Limpiar el formulario
        resetForm()

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

