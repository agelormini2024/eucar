"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { CambiarPasswordSchema } from '@/src/schema';
import { zodResolver } from '@hookform/resolvers/zod';

type CambiarPasswordForm = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ProfilePage() {
    const { data: session } = useSession();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CambiarPasswordForm>({
        resolver: zodResolver(CambiarPasswordSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: result.error || 'Error al cambiar la contraseña' });
                return;
            }

            setMessage({ type: 'success', text: 'Contraseña cambiada exitosamente' });
            reset(); // Limpiar el formulario
            
        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'error', text: 'Error interno del servidor' });
        } finally {
            setIsLoading(false);
        }
    });

    if (!session) {
        return (
            <div className="h-[calc(100vh - 7rem)] flex items-center justify-center">
                <p>Debes iniciar sesión para acceder a tu perfil</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh - 7rem)] bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Mi Perfil</h1>
                    
                    {/* Información del usuario */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <h2 className="text-lg font-semibold mb-3 text-gray-700">Información Personal</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Nombre:</span> {session.user?.name}</p>
                            <p><span className="font-medium">Email:</span> {session.user?.email}</p>
                        </div>
                    </div>

                    {/* Formulario cambiar contraseña */}
                    <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Cambiar Contraseña</h2>
                        
                        {message && (
                            <div className={`p-4 rounded-md mb-4 ${
                                message.type === 'success' 
                                    ? 'bg-green-100 border border-green-400 text-green-700'
                                    : 'bg-red-100 border border-red-400 text-red-700'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label 
                                    htmlFor="currentPassword" 
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Contraseña Actual
                                </label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                        errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ingresa tu contraseña actual"
                                    {...register("currentPassword")}
                                />
                                {errors.currentPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                                )}
                            </div>

                            <div>
                                <label 
                                    htmlFor="newPassword" 
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nueva Contraseña
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ingresa tu nueva contraseña"
                                    {...register("newPassword")}
                                />
                                {errors.newPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                                )}
                            </div>

                            <div>
                                <label 
                                    htmlFor="confirmPassword" 
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Confirmar Nueva Contraseña
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Confirma tu nueva contraseña"
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                    isLoading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}