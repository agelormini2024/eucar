import ButtonGoBack from "@/components/ui/ButtonGoBack";
import Logo from "@/components/ui/Logo";
import UtilidadesSidebar from "@/components/utilidades/UtilidadesSidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="md:flex">
                <aside className="flex flex-col items-center md:w-72 md:h-screen">
                    <Logo />
                    <UtilidadesSidebar />
                </aside>
                <main className="md:flex-1 md:h-screen md:overflow-y-scrollv m-0 p-5">
                    {children}
                </main>
            </div>
        </>
    )
}  