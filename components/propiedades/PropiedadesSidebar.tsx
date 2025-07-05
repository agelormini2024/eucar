
import PropiedadesRoute from './PropiedadesRoute'

const menuPropiedades = [
    { url: '/admin/propiedades/list', text: 'Propiedades', blank: false, key: 1 },
    { url: '/admin/propiedades/alta', text: 'Alta de Propiedades', blank: false, key: 2 },
]

export default function PropiedadesSidebar() {
    return (
        <>
            <div className='space-y-3'>
                <p className='mt-10 uppercase font-bold text-gray-600 text-center'>Navegación</p>
                <div className='p-5 px-10'>
                    <nav className='flex flex-col uppercase'>
                        {menuPropiedades.map((link) => (
                            <PropiedadesRoute
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
