import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import { UsuarioSchema } from "@/src/schema";

export async function POST(request: Request) {

    const data = await request.json()
    const { email, nombre, password } = data

    const result = UsuarioSchema.safeParse(data); // Validar los datos con Zod
    if (!result.success) {
        return NextResponse.json({ 
            error: result.error.issues.map(issue => issue.message).join(", ") }, 
            { status: 400 });
    }

    if (!email || !nombre || !password) {
        return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    try {
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
            }
        })

        return new Response(JSON.stringify({
            message: "Usuario registrado correctamente",
            nuevoUsuario: {
                id: nuevoUsuario.id,
                email: nuevoUsuario.email,
                nombre: nuevoUsuario.nombre
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