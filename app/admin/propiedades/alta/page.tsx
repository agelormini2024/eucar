import AddPropiedadForm from '@/components/propiedades/AddPropiedadForm'
import PropiedadForm from '@/components/propiedades/PropiedadForm'
import Headers from '@/components/ui/Headers'

export default function AltaPropiedadPage() {
    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Alta de Propiedades</Headers>
                </div>
            </div>
            <div>
                <AddPropiedadForm>
                    <PropiedadForm />
                </AddPropiedadForm>
            </div>
        </>
    )
}
