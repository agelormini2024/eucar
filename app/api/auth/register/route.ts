

export async function POST(request: Request) {

    const data = await request.json()
    const { email, password, nombre } = data
    console.log("Datos recibidos:", data)

    return new Response(JSON.stringify({
        message: "Usuario registrado correctamente",
        user: {
            email,
            nombre
        }
    }), {
        status: 201,
        headers: {
            "Content-Type": "application/json"
        }
    })
    
}