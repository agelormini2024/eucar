"use client"
import { signOut } from "next-auth/react"


export default function ButtonLogout() {
    return (
        <button
            onClick={() => signOut()}
            className="bg-slate-400 text-white hover:bg-slate-600 text-sm font-bold py-1 px-4 rounded transition"
        >
            Log-out
        </button>
    )
}
