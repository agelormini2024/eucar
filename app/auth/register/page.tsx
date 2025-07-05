"use client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react";
import { set } from "zod";

export default function RegisterPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState<string | null>(null);

    const onSubmit = handleSubmit(async data => {

        if (data.password !== data.confirmarPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        // Enviar los datos al servidor
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        
        if (!res.ok) {
            const resJSON = await res.json();
            setError(resJSON.error)
            return;
        }if (res.ok && res.status === 201) {
            router.push('/auth/login'); // Redirigir al login después del registro
            return;
        }

    })
    return (
        <div className="h-[clac(100vh - 7rem)] flex items-center justify-center">
            <form onSubmit={onSubmit} className="mt-20 w-1/4 bg-white p-5 rounded-lg shadow-lg">

                {error && <p className="bg-red-700 text-center p-2 text-white font-black mb-4">{error}</p>}

                <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
                <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="nombre">
                    Nombre de Usuario
                    {errors.usuario && <span className="text-red-500"> - El nombre de usuario es obligatorio y debe tener al menos 3 caracteres</span>}
                </label>
                <input
                    id="nombre"
                    type="text"
                    className="p-3 rounded block w-full mb-2 bg-red-50"
                    placeholder="Nombre de Usuario"
                    {...register("nombre", { required: true, minLength: 3 })}
                />
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
                <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="confirmarPassword">
                    Confirmar Contraseña
                    {errors.confirmarPassword && <span className="text-red-500"> - La confirmación de contraseña es obligatoria y debe tener al menos 6 caracteres</span>}
                </label>
                <input
                    id="confirmarPassword"
                    type="password"
                    className="p-3 rounded block w-full mb-2 bg-red-50"
                    placeholder="******"
                    {...register("confirmarPassword", { required: true, minLength: 6 })}
                />

                <button
                    className="bg-red-700 text-white p-2 mt-4 rounded-md w-full font-bold text-xl hover:bg-red-500 transition-colors">
                    Registrarse
                </button>
            </form>
        </div>
    )
}
