import UtilidadesRoute from './UtilidadesRoute'

const menuItems = [
    { url: '/admin/utilidades/indices', text: 'Indices', blank: false, key: 1 },
]

export default function UtilidadesSidebar() {
    
    return (
        <>
            <div>
                <div className="space-y-3">
                    <p className="mt-10 uppercase font-bold text-gray-600 text-center">Navegación</p>
                    <div className="p-5 px-10">
                        <nav className="flex flex-col uppercase">
                            {menuItems.map((link) => (
                                <UtilidadesRoute
                                    key={link.key}
                                    link={link}
                                />
                            ))}
                        </nav>
                    </div>
                </div>

            </div>
        </>
    )
}
