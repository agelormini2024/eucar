import PropiedadesSidebar from "@/components/propiedades/PropiedadesSidebar";
import Logo from "@/components/ui/Logo";
import ToastNotification from '@/components/ui/ToastNotification';

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
                    <PropiedadesSidebar />
                </aside>
                <main className="md:flex-1 md:h-screen md:overflow-y-scroll p-5">
                    {children}
                </main>
            </div>
            <ToastNotification />
        </>
    )
}  