import AdminAlquileresSidebar from "@/components/contratos/AlquileresSidebar";
import ToastNotification from "@/components/ui/ToastNotification";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="md:flex">
                <aside className="md:w-72 md:h-screen">
                    <AdminAlquileresSidebar />
                </aside>
                <main className="md:flex-1 md:h-screen md:overflow-y-scroll p-5">
                    {children}
                </main>
            </div>
            <ToastNotification />
        </>
    )
}  