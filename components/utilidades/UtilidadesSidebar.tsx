import UtilidadesRoute from './UtilidadesRoute'

const menuItems = [
    { url: '/admin/utilidades/indices', text: 'Indices', blank: false, key: 1 },
]

export default function UtilidadesSidebar() {
    
    return (
        <>
            <div>
                <div className="space-y-3 mt-15">

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
