import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/auth/options";
import { prisma } from "@/src/lib/prisma";
import { InvitacionSchema } from "@/src/schema";
import { randomUUID } from "crypto";

// GET - Listar invitaciones (solo admins)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // Solo admins pueden ver invitaciones
        if (session.user.rol !== "admin") {
            return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
        }

        const invitaciones = await prisma.invitacion.findMany({
            include: {
                creador: {
                    select: {
                        nombre: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(invitaciones);
        
    } catch (error) {
        console.error("Error al obtener invitaciones:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

// POST - Crear nueva invitación
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // Solo admins pueden crear invitaciones
        if (session.user.rol !== "admin") {
            return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
        }

        const data = await request.json();
        
        // Validar datos
        const result = InvitacionSchema.safeParse(data);
        if (!result.success) {
            return NextResponse.json({ 
                error: result.error.issues.map(issue => issue.message).join(", ") 
            }, { status: 400 });
        }

        const { email } = result.data;

        // Verificar que el email no esté ya registrado
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { email }
        });

        if (usuarioExistente) {
            return NextResponse.json({ 
                error: "Este email ya tiene un usuario registrado" 
            }, { status: 400 });
        }

        // Verificar que no haya una invitación pendiente
        const invitacionExistente = await prisma.invitacion.findFirst({
            where: {
                email,
                usado: false,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (invitacionExistente) {
            return NextResponse.json({ 
                error: "Ya existe una invitación pendiente para este email" 
            }, { status: 400 });
        }

        // Crear nueva invitación
        const codigo = randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 7 días

        const nuevaInvitacion = await prisma.invitacion.create({
            data: {
                email,
                codigo,
                creadoPor: parseInt(session.user.id),
                expiresAt
            },
            include: {
                creador: {
                    select: {
                        nombre: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json({
            message: "Invitación creada exitosamente",
            invitacion: nuevaInvitacion,
            linkRegistro: `${process.env.NEXTAUTH_URL}/auth/register?codigo=${codigo}`
        }, { status: 201 });

    } catch (error) {
        console.error("Error al crear invitación:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}