"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Extensión temporal de tipos para session
interface ExtendedUser {
    id?: string;
    email?: string | null;
    name?: string | null;
    rol?: string;
}

interface ExtendedSession {
    user?: ExtendedUser;
}

export default function InvitacionesPage() {
    const { data: session } = useSession() as { data: ExtendedSession | null };
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [linkGenerado, setLinkGenerado] = useState<string | null>(null);

    // Verificar permisos
    if (session?.user?.rol !== "admin") {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Acceso denegado:</strong> Solo los administradores pueden acceder a esta página.
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMensaje(null);
        setLinkGenerado(null);

        try {
            const res = await fetch('/api/invitaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Error al crear invitación');
                return;
            }

            setMensaje('Invitación creada exitosamente');
            setLinkGenerado(data.linkRegistro);
            setEmail(''); // Limpiar formulario

        } catch (err) {
            setError('Error de conexión. Intenta nuevamente.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const copiarLink = () => {
        if (linkGenerado) {
            navigator.clipboard.writeText(linkGenerado);
            alert('Link copiado al portapapeles');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Gestión de Invitaciones</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Crear Nueva Invitación</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email del nuevo usuario
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="usuario@ejemplo.com"
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full bg-red-700 text-white py-3 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {loading ? 'Creando...' : 'Crear Invitación'}
                        </button>
                    </form>
                </div>

                {/* Mensajes */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {mensaje && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {mensaje}
                    </div>
                )}

                {/* Link generado */}
                {linkGenerado && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                        <h3 className="font-semibold mb-2">Link de registro generado:</h3>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={linkGenerado}
                                readOnly
                                className="flex-1 p-2 border border-blue-300 rounded text-sm bg-white"
                            />
                            <button
                                onClick={copiarLink}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                Copiar
                            </button>
                        </div>
                        <p className="text-sm mt-2">
                            Comparte este link con el nuevo usuario. Expira en 7 días.
                        </p>
                    </div>
                )}

                <div className="mt-6">
                    <button
                        onClick={() => router.push('/')}
                        className="text-red-700 hover:text-red-900 font-medium"
                    >
                        ← Volver al Panel de Administración
                    </button>
                </div>
            </div>
        </div>
    );
}