import HomeRoute from "./HomeRoute"

export default function MenuBar() {

    const adminNavigation = [
        { url: '/admin/alquileres', text: 'Alquileres', blank: false },
        { url: '/admin/propiedades', text: 'Propiedades', blank: false },
        { url: '/admin/clientes', text: 'Clientes', blank: false },
    ]

    return (
        <div>
            <header className="border-b-4 border-red-800">
                <div className="p-3 px-10">
                    <nav className="flex md:justify-end sm:justify-center font-bold space-x-8 uppercase">
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
