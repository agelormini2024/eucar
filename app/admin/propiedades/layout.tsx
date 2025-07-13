import PropiedadesSidebar from "@/components/propiedades/PropiedadesSidebar";
import ButtonGoBack from "@/components/ui/ButtonGoBack";
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
                <aside className="md:w-72 md:h-screen">
                    <PropiedadesSidebar />
                </aside>
                <main className="md:flex-1 md:h-screen md:overflow-y-scroll">
                    {children}
                </main>
            </div>
            <ToastNotification />
        </>
    )
}  