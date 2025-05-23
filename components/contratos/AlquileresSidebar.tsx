import Logo from "../ui/Logo";
import AlquileresRoute from "./AlquileresRoute";

const menuItems = [
    { url: '/admin/contratos/list', text: 'Contratos', blank: false , key: 1},
    { url: '/admin/contratos/alta', text: 'Nuevo Contrato', blank: false, key:2 },
    { url: '/admin/recibos/list', text: 'Recibos', blank: false , key: 3},
    { url: '/admin/recibos/alta', text: 'Nuevo Recibo', blank: false, key:4 },
    { url: '/admin/recibos/indices', text: 'Procesar Indices', blank: false, key:5 },
]

export default function AlquileresSidebar() {
    return (
        <>
            <Logo />
            <div className="space-y-3">
                <p className="mt-10 uppercase font-bold text-gray-600 text-center">Navegación</p>
                <div className="p-5 px-10">
                    <nav className="flex flex-col uppercase">
                        {menuItems.map((link) => (
                            <AlquileresRoute
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
