"use client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState<string | null>(null);

    const onSubmit = handleSubmit(async data => {
        // Enviar los datos al servidor
        const res = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false // Evitar redirección automática
        })

        if (!res?.ok) {
            setError(res?.error ?? null) // Mostrar el error si la autenticación falla
        } else {
            // Redirigir al usuario a la página de inicio después de iniciar sesión
            router.push('/')
            router.refresh()
        }
    })
    return (
        <div className="h-[calc(100vh - 7rem)] flex items-center justify-center">
            <form onSubmit={onSubmit} className="mt-20 w-1/4 bg-white p-5 rounded-lg shadow-lg">

                {error && <p className="bg-red-700 text-center p-2 text-white font-black mb-4">{error}</p>}

                <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
                <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="email">
                    Correo Electrónico
                    {errors.email && <span className="text-red-500"> - El correo electrónico es obligatorio y debe ser válido</span>}
                </label>
                <input
                    id="email"
                    type="email"
                    className="p-3 rounded block w-full mb-2 bg-red-50"
                    placeholder="mail@mail.com"
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                />
                <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="password">
                    Contraseña
                    {errors.password && <span className="text-red-500"> - La contraseña es obligatoria y debe tener al menos 6 caracteres</span>}
                </label>
                <input
                    id="password"
                    type="password"
                    className="p-3 rounded block w-full mb-2 bg-red-50"
                    placeholder="******"
                    {...register("password", { required: true, minLength: 6 })}
                />
                <button
                    className="bg-red-700 text-white p-2 mt-4 rounded-md w-full font-bold text-xl hover:bg-red-500 transition-colors">
                    Iniciar Sesión
                </button>
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600 font-bold">¿No tienes una cuenta?</p>
                    <a href="/auth/register"
                        className="text-red-900 text-sm font-bold hover:underline">
                        Regístrate aquí
                    </a>
                </div>
            </form>
        </div>
    )
}
