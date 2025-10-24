"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ForgotPasswordSchema } from '@/src/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

type ForgotPasswordForm = {
    email: string;
}

export default function ForgotPasswordPage() {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(ForgotPasswordSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: result.error || 'Error al procesar la solicitud' });
                return;
            }

            setMessage({ 
                type: 'success', 
                text: result.message || 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
            });
            reset(); // Limpiar el formulario
            
        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'error', text: 'Error interno del servidor' });
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Recuperar Contraseña
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
                    </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-6">
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
                                htmlFor="email" 
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Ingresa tu email"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
                            {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                        </button>
                    </form>

                    <div className="text-center mt-4 space-y-2">
                        <Link href="/auth/login" 
                              className="text-red-900 text-sm hover:underline block">
                            ← Volver al inicio de sesión
                        </Link>
                        <Link href="/auth/register" 
                              className="text-gray-600 text-sm hover:underline block">
                            ¿No tienes cuenta? Regístrate aquí
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}