import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/src/lib/prisma";
import { UsuarioRegistroConInvitacionSchema } from "@/src/schema";

export async function POST(request: Request) {

    const data = await request.json()
    const { email, nombre, password, confirmarPassword, codigoInvitacion } = data

    // Validar que todos los campos estén presentes
    if (!email || !nombre || !password || !confirmarPassword || !codigoInvitacion) {
        return NextResponse.json({ error: "Todos los campos son obligatorios, incluyendo el código de invitación" }, { status: 400 });
    }

    // Validar con Zod (incluye validación de contraseñas coincidentes)
    const result = UsuarioRegistroConInvitacionSchema.safeParse(data);
    if (!result.success) {
        return NextResponse.json({ 
            error: result.error.issues.map(issue => issue.message).join(", ") }, 
            { status: 400 });
    }

    try {
        // Verificar código de invitación
        const invitacion = await prisma.invitacion.findUnique({
            where: {
                codigo: codigoInvitacion
            }
        });

        if (!invitacion) {
            return NextResponse.json({ error: "Código de invitación inválido" }, { status: 400 });
        }

        // Verificar que no esté usado
        if (invitacion.usado) {
            return NextResponse.json({ error: "Este código de invitación ya ha sido utilizado" }, { status: 400 });
        }

        // Verificar que no esté expirado
        if (invitacion.expiresAt < new Date()) {
            return NextResponse.json({ error: "Este código de invitación ha expirado" }, { status: 400 });
        }

        // Verificar que el email coincida con la invitación
        if (invitacion.email !== email) {
            return NextResponse.json({ error: "El email no coincide con la invitación" }, { status: 400 });
        }

        const usuarioExistente = await prisma.usuario.findFirst({
            where: {
                nombre: data.nombre
            }
        })
        if (usuarioExistente) {
            return NextResponse.json({ error: "El nombre de usuario ya está en uso" }, { status: 400 });
        }

        const emailExistente = await prisma.usuario.findFirst({
            where: {
                email: data.email
            }
        })
        if (emailExistente) {
            return NextResponse.json({ error: "El correo electrónico ya está registrado" }, { status: 400 });
        }

        const hashedPassword =  await bcrypt.hash(data.password, 10);  
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                email: email,
                password: hashedPassword,
                nombre: nombre,
                rol: "usuario" // Usuarios invitados son usuarios normales por defecto
            }
        })

        // Marcar invitación como usada
        await prisma.invitacion.update({
            where: {
                id: invitacion.id
            },
            data: {
                usado: true,
                usadoAt: new Date()
            }
        });

        return new Response(JSON.stringify({
            message: "Usuario registrado correctamente",
            nuevoUsuario: {
                id: nuevoUsuario.id,
                email: nuevoUsuario.email,
                nombre: nuevoUsuario.nombre,
                rol: nuevoUsuario.rol
            }
        }), {
            status: 201,
            headers: {
                "Content-Type": "application/json"
            }
        })

    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });

    }
}