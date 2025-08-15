"use client"
import { signOut } from "next-auth/react"


export default function ButtonLogout() {
    return (
        <button
            onClick={() => signOut()}
            className="bg-transparent text-white hover:bg-slate-400 text-sm font-bold py-1 px-2 rounded-xl transition"
        >
            {/* Icono SVG de logout */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
        </button>
    )
}
