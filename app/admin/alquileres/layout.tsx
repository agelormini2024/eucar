import AdminSidebar from "@/components/admin/AdminSidebar";
import Heading from "@/components/ui/Heading";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="md:flex">
                <aside className="md:w-72 md:h-screen bg-slate-100">
                    <AdminSidebar />
                </aside>

                <main className="md:flex-1 md:h-screen md:overflow-y-scroll bg-gray-50 p-5">
                    {children}
                </main>
            </div>
        </>
    )
}  