// Este componente es un botón que al hacer click te lleva a la página anterior
"use client"
import { useRouter } from "next/navigation";



export default function ButtonGoBack() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="w-full bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-10 rounded"
        >
            Volver
        </button>
    )
}
