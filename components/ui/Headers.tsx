// Títulos para las paginas de la aplicación

export default function Headers({ children }: { children: React.ReactNode }) {
    return (
        <h1
            className='text-2xl font-semibold'
        >
            {children}
        </h1>
    )
}
