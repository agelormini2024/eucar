"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

type ClientesRouteProps = {
    link: {
        url: string
        text: string
        blank?: boolean
        key: number
    }
}

export default function ClientesRoute({ link }: ClientesRouteProps) {
    const pathname = usePathname()
    const isActive = pathname.startsWith(link.url) // Esto lo usamos en el caso que queramos que el link se vea activo

    return (
        <Link
            className={`${isActive ? 'bg-red-200 ' : ''}font-bold border-t border-gray-500 p-3 last-of-type:border-b`} href={link.url}
            target={link.blank ? "_blank" : undefined}
        >
            {link.text}
        </Link>
    )}
