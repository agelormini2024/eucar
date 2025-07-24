import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/ui/NavBar";
import SessionGuard from "@/components/ui/SessionGuard";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SOARES PARENTE PROPIEDADES",
    description: "Bienes raíces",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100`}>
                <div className="flex justify-end items-center bg-gradient-to-t from-slate-100 via-slate-300 to-slate-500 p-0.5">
                    <SessionGuard />
                    <NavBar />
                </div>
                {children}
            </body>
        </html>
    );
}
