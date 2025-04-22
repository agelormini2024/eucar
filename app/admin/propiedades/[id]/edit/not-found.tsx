import Headers from "@/components/ui/Headers";
import Link from "next/link";


export default function NotFound() {
    return (
        <div className="mt-10 flex justify-center flex-col text-center">

            <Headers>Propiedad no encontrada</Headers>
            <Link
                href={`/admin/propiedades/list`}
                className=" bg-red-800 hover:bg-red-600 text-xl text-white font-bold mt-10 py-3 lg:w-auto px-10 rounded w-auto mx-auto"

            > Volver a Propiedades</Link>

        </div>
    )
}
