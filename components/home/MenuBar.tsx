import HomeRoute from "./HomeRoute"

export default function MenuBar() {

    const adminNavigation = [
        { url: '/admin/alquileres', text: 'Alquileres', blank: false },
        { url: '/admin/propiedades', text: 'Propiedades', blank: false },
        { url: '/admin/clientes', text: 'Clientes', blank: false },
    ]

    return (
        <div>
            <header className="bg-gray-600">
                <div className="p-5 px-10">
                    <nav className="flex md:justify-end sm:justify-center text-white font-bold space-x-8 uppercase">
                        {adminNavigation.map((link) => (
                            <HomeRoute
                                key={link.url}
                                link={link}
                            />
                        ))}
                    </nav>
                </div>
            </header>
        </div>
    )
}
