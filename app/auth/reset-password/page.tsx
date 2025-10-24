"use client"
import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { ResetPasswordSchema } from '@/src/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type ResetPasswordForm = {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

function ResetPasswordForm() {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<ResetPasswordForm>({
        resolver: zodResolver(ResetPasswordSchema)
    });

    useEffect(() => {
        // Obtener el token de los parámetros de la URL
        const token = searchParams.get('token');
        if (token) {
            setValue('token', token);
        } else {
            setMessage({ 
                type: 'error', 
                text: 'Token no válido. Solicita un nuevo enlace de recuperación.' 
            });
        }
    }, [searchParams, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: result.error || 'Error al restablecer la contraseña' });
                return;
            }

            setMessage({ type: 'success', text: result.message });
            
            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
            
        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'error', text: 'Error interno del servidor' });
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {message && (
                <div className={`p-4 rounded-md mb-4 ${
                    message.type === 'success' 
                        ? 'bg-green-100 border border-green-400 text-green-700'
                        : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                    {message.text}
                    {message.type === 'success' && (
                        <p className="mt-2 text-sm">Serás redirigido al login en unos segundos...</p>
                    )}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                {/* Token oculto */}
                <input
                    type="hidden"
                    {...register("token")}
                />

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
                    disabled={isLoading || message?.type === 'success'}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                        (isLoading || message?.type === 'success')
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                    {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                </button>
            </form>

            <div className="text-center mt-4">
                <Link href="/auth/login" 
                      className="text-red-900 text-sm hover:underline">
                    ← Volver al inicio de sesión
                </Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Restablecer Contraseña
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ingresa tu nueva contraseña
                    </p>
                </div>
                
                <Suspense fallback={
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-10 bg-gray-300 rounded"></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-10 bg-gray-300 rounded"></div>
                            <div className="h-10 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}