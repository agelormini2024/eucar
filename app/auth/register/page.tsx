"use client"
import { useForm } from "react-hook-form"

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = handleSubmit(data => {
        if (data.password !== data.confirmarPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        // Aquí puedes enviar los datos al servidor o procesarlos como necesites
        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Aquí puedes manejar la respuesta del servidor, como redirigir al usuario o mostrar un mensaje de éxito
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        // Eliminar confirmarPassword antes de enviar los datos
        delete data.confirmarPassword;
        console.log(data);
    })
    return (
        <div className="h-[clac(100vh - 7rem)] flex items-center justify-center">
            <form onSubmit={onSubmit} className="mt-20 w-1/4 bg-white p-5 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Registrarse</h1>
                <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="usuario">
                    Nombre de Usuario
                    {errors.usuario && <span className="text-red-500"> - El nombre de usuario es obligatorio y debe tener al menos 3 caracteres</span>}
                </label>
                <input
                    type="text"
                    className="p-3 rounded block w-full mb-2 bg-red-50"
                    placeholder="Nombre de Usuario"
                    {...register("usuario", { required: true, minLength: 3 })}
                />
                <label 
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="email">
                    Correo Electrónico
                    {errors.email && <span className="text-red-500"> - El correo electrónico es obligatorio y debe ser válido</span>}
                </label>
                <input
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
