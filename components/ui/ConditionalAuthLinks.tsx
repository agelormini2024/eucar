"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ConditionalAuthLinks() {
    const pathname = usePathname();

    return (
        <>
            {pathname === '/auth/login' ? (
                <Link href="/auth/register"
                    className="text-red-900 font-bold hover:underline">
                    Registrarse
                </Link>
            ) : pathname === '/auth/register' ? (
                <Link href="/auth/login"
                    className="text-red-900 font-bold hover:underline">
                    Login
                </Link>
            ) : (
                <Link href="/auth/login"
                    className="text-red-900 font-bold hover:underline">
                    Login
                </Link>
            )}
        </>
    );
}