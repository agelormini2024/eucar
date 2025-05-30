import IndicesForm from '@/components/utilidades/IndicesForm'
import MostrarIndices from '@/components/utilidades/MostrarIndices'
import { revalidatePath } from 'next/cache'



export default function IndicePage() {
    return (
        <>
            <h1 className='text-2xl font-bold'>Indices</h1>
            <form action={async () => {
                "use server"
                revalidatePath('/admin/utilidades/indices')
            }}>
                <input
                    type="submit"
                    value="Refrescar Cache"
                    className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-500 cursor-pointer font-bold mb-4"
                />
            </form>

            <div className='bg-white max-w-lg mx-auto'>
                <IndicesForm>
                    <MostrarIndices />
                </IndicesForm>
            </div>
        </>
    )
}
