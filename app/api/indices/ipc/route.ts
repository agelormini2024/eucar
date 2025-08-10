"use server"
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { IpcSchema } from '@/src/schema'

type IPCDato = {
    fecha: string
    inflacion: number
}

type ItemDato = [
    fecha: string,
    inflacion: number
][]

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const desde = searchParams.get('desde')
    const hasta = searchParams.get('hasta')

    const apiUrl =
        'https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26&limit=5000&format=json'

    try {
        const response = await axios.get(apiUrl)
        const result = IpcSchema.parse(response.data)
        const { data: valores } = result

        if (!valores || !Array.isArray(valores)) {
            return NextResponse.json({ error: 'No se pudo obtener la serie de datos del IPC' }, { status: 500 })
        }

        const datos: {
            date: string;
            value: number
        }[] = (valores as ItemDato)
            .filter((item) => Array.isArray(item) && item[0] && item[1] != null)
            .map(([date, value]) => ({
                date: (date as string).substring(0, 10),
                value: value as number,
            }))

        // Fechas disponibles para debug

        const fechasDisponibles = datos.map(d => d.date)

        // Filtrar por fechas si se especifican
        const datosFiltrados = datos.filter((item) => {
            const añoMes = item.date.substring(0, 7)
            const dentroDesde = !desde || añoMes >= desde
            const dentroHasta = !hasta || añoMes <= hasta
            return dentroDesde && dentroHasta
        })
        // Fechas fechas Filtradas para debug

        const fechasFiltradas = datosFiltrados.map(d => d.date)

        if (datosFiltrados.length < 2) {
            return NextResponse.json({
                error: 'Se necesitan al menos dos registros para calcular la inflación',
                desde,
                hasta,
                fechasFiltradas,
                fechasDisponibles,
            }, { status: 400 })
        }

        // Calcular inflación mensual
        const inflacionMensual: IPCDato[] = datosFiltrados.slice(1).map((item, i) => {
            const actual = item.value
            const anterior = datosFiltrados[i].value
            const variacion = ((actual - anterior) / anterior) * 100

            return {
                fecha: item.date,
                inflacion: parseFloat(variacion.toFixed(2)),
            }
        })

        // Calcular inflación acumulada
        const valorInicial = datosFiltrados[0].value
        const valorFinal = datosFiltrados[datosFiltrados.length - 1].value
        const inflacionAcumulada = parseFloat(((valorFinal - valorInicial) / valorInicial * 100).toFixed(2))

        return NextResponse.json({
            inflacionMensual,
            inflacionAcumulada,
        })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
}