// components/SessionGuard.tsx
"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SessionGuard() {
    useEffect(() => {
        const handleUnload = () => {
            signOut({ redirect: false });
        };
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, []);
    return null;
}