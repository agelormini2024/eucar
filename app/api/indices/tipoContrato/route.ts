import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
    const tipoContrato = await prisma.tipoContrato.findMany({
        orderBy: { cantidadMesesActualizacion: 'asc' }
    })
    return NextResponse.json(tipoContrato)
}