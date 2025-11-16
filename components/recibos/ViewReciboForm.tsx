"use client"
import { useEffect } from "react"
import useRecibosFormStore from "@/src/stores/storeRecibos"
import ButtonGoBack from "../ui/ButtonGoBack"

export default function ViewReciboForm({ children }: { children: React.ReactNode }) {
    const { resetForm } = useRecibosFormStore()

    useEffect(() => {
        return () => {
            resetForm();
        }
    }, [resetForm]);

    // NO hay handleSubmit, este componente solo muestra datos
    
    return (
        <div className='bg-white shadow-xl mt-10 px-5 py-10 rounded-md max-w-5xl mx-auto'>
            {/* Sin <form>, solo contenedor visual */}
            <div className="space-y-5">
                {children}
                
                {/* Solo botón de volver, sin submit */}
                <div className="mt-8 flex justify-center">
                    <ButtonGoBack />
                </div>
            </div>
        </div>
    )
}
