// Este componente es un botón que al hacer click te lleva a la página anterior
"use client"
import { useRouter } from "next/navigation";



export default function ButtonGoBack() {
    const router = useRouter();

    return (
        <>
            <div className="flex justify-end mt-5">
                <button
                    onClick={() => router.back()}
                    className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-8 transition-colors duration-400 cursor-pointer rounded"
                >
                    Volver
                </button>
            </div>
        </>

    )
}
