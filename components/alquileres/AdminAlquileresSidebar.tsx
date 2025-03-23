import Logo from "../ui/Logo";
import AdminAlquileresRoute from "./AdminAlquileresRoute";

const menuItems = [
    { url: '/admin/alquileres/contratos', text: 'Contratos', blank: false , key: 1},
    { url: '/admin/alquileres/alta', text: 'Alta de alquileres', blank: false, key:2 },
]

export default function AdminAlquileresSidebar() {
    return (
        <>
            <Logo />
            <div className="space-y-3">
                <p className="mt-10 uppercase font-bold text-gray-600 text-center">Navegación</p>
                <div className="p-5 px-10">
                    <nav className="flex flex-col uppercase">
                        {menuItems.map((link) => (
                            <AdminAlquileresRoute
                                key={link.key}
                                link={link}
                            />
                        ))}
                    </nav>
                </div>
            </div>
        </>
    )
}
