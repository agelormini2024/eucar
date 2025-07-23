import Headers from "@/components/ui/Headers";
import Logo from "@/components/ui/Logo";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
        <div>

            <header className="flex flex-row justify-between items-center mx-8 uppercase">
                <Logo />
                <Headers>Soares Parente Propiedades</Headers>
            </header>
        </div>

            {children}
        </>
    )
}  