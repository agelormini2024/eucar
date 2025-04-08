import { PrismaClient } from '@prisma/client'
import { paises } from './data/paises'
import { provincias } from './data/provincias'
import { rolCliente } from './data/rolClientes'
import { clientes } from './data/clientes'
import { propiedades } from './data/propiedades'

const prisma = new PrismaClient()

async function main() {
    try {
        // Truncar tablas y reiniciar IDs
        await prisma.$executeRaw`TRUNCATE TABLE "Cliente" RESTART IDENTITY CASCADE;`
        await prisma.$executeRaw`TRUNCATE TABLE "RolCliente" RESTART IDENTITY CASCADE;`
        await prisma.$executeRaw`TRUNCATE TABLE "Provincia" RESTART IDENTITY CASCADE;`
        await prisma.$executeRaw`TRUNCATE TABLE "Pais" RESTART IDENTITY CASCADE;`
        await prisma.$executeRaw`TRUNCATE TABLE "Propiedad" RESTART IDENTITY CASCADE;`
        
        // Insertar datos
        await prisma.pais.createMany({
            data: paises
        })
        await prisma.provincia.createMany({
            data: provincias
        })
        await prisma.rolCliente.createMany({
            data: rolCliente
        })
        await prisma.cliente.createMany({
            data: clientes
        })
        await prisma.propiedad.createMany({
            data: propiedades
        })

    } catch (error) {
        console.error(error)
    }
}

main()
    .then( async() => {
        console.log('Seed completado')
        await prisma.$disconnect()
    })
    .catch( async(error) => {
        console.error(error)
        await prisma.$disconnect()
        process.exit(1)
    })
    