"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

type HomeRouteProps = {
    link: {
        url: string;
        text: string;
        blank?: boolean;
    }
}

export default function HomeRoute({ link }: HomeRouteProps) {

    const pathname = usePathname();
    const isActive = pathname.startsWith(link.url);  // Esto lo usamos en el caso que queramos que el link se vea activo

    return (
        <Link
            className={`${isActive ? "text-red-300" : "text-black"}  hover:text-red-700`}
            href={link.url}
            target={link.blank ? "_blank" : undefined}
        >
            {link.text}
        </Link>
    )
}
