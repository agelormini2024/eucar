import Logo from '../ui/Logo'
import ClientesRoute from './ClientesRoute'



const menuPropiedades = [
    { url: '/admin/clientes/list', text: 'Clientes', blank: false , key: 1},
    { url: '/admin/clientes/alta', text: 'Alta de Clientes', blank: false, key:2 },
]

export default function ClientesSideBar() {
    return (
        <>
            <Logo />
            <div className='space-y-3'>
                <p className='mt-10 uppercase font-bold text-gray-600 text-center'>Navegación</p>
                <div className='p-5 px-10'>
                    <nav className='flex flex-col uppercase'>
                        {menuPropiedades.map((link) => (
                            <ClientesRoute
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
