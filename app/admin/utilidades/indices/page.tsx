
import IndicesForm from '@/components/utilidades/IndicesForm'
import MostrarIndices from '@/components/utilidades/MostrarIndices'

export default function IndicePage() {
    
    return (
        <>

            <h1 className='text-2xl font-bold'>Indices</h1>

            <div className='bg-white max-w-sm mx-auto'>
                {/* <IndicesForm/> */}
                <IndicesForm>
                    <MostrarIndices/>
                </IndicesForm>
            </div>
        </>
    )
}
