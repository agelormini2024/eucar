// Títulos para las paginas de la aplicación

export default function Headers({ children }: { children: React.ReactNode }) {
    return (
        <h1
            className='text-3xl font-semibold text-red-800'
        >
            {children}
        </h1>
    )
}
