import ButtonGoBack from "@/components/ui/ButtonGoBack";
import UtilidadesSidebar from "@/components/utilidades/UtilidadesSidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="md:flex">
                <aside className="md:w-72 md:h-screen bg-slate-100">
                    <UtilidadesSidebar />
                </aside>
                <main className="md:flex-1 md:h-screen md:overflow-y-scrollv m-0 bg-slate-50 p-5">
                    {children}
                </main>
            </div>
        </>
    )
}  