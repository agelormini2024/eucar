import { PrismaClient } from '@prisma/client'
import { paises } from './data/paises'
import { provincias } from './data/provincias'
import { clientes } from './data/clientes'
import { propiedades } from './data/propiedades'
import { tiposPropiedad } from './data/tiposPropiedad'
import { tiposIndice } from './data/tiposIndice'
import { tiposContrato } from './data/tiposContrato'
import { estadoRecibo } from './data/estadoRecibo'

const prisma = new PrismaClient()

async function main() {
    try {
        // Truncar tablas y reiniciar IDs
        await prisma.$executeRaw`TRUNCATE TABLE "Cliente" RESTART IDENTITY CASCADE;`
        await prisma.$executeRaw`TRUNCATE TABLE "Provincia" RESTART IDENTITY CASCADE;`
        await prisma.$executeRaw`TRUNCATE TABLE "Pais" RESTART IDENTITY CASCADE;`
        await prisma.$executeRaw`TRUNCATE TABLE "Propiedad" RESTART IDENTITY CASCADE;`
        await prisma.$executeRaw`TRUNCATE TABLE "TipoPropiedad" RESTART IDENTITY CASCADE;`
        await prisma.$executeRaw`TRUNCATE TABLE "TipoIndice" RESTART IDENTITY CASCADE;`
        await prisma.$executeRaw`TRUNCATE TABLE "TipoContrato" RESTART IDENTITY CASCADE;`
        await prisma.$executeRaw`TRUNCATE TABLE "EstadoRecibo" RESTART IDENTITY CASCADE;`
        
        // Insertar datos
        await prisma.pais.createMany({
            data: paises
        })
        await prisma.provincia.createMany({
            data: provincias
        })
        await prisma.cliente.createMany({
            data: clientes
        })
        await prisma.tipoPropiedad.createMany({
            data: tiposPropiedad
        })
        await prisma.propiedad.createMany({
            data: propiedades
        })
        await prisma.tipoIndice.createMany({
            data: tiposIndice
        })
        await prisma.tipoContrato.createMany({
            data: tiposContrato
        })
        await prisma.estadoRecibo.createMany ({
            data: estadoRecibo
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
    