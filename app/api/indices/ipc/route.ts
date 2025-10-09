"use server"
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

type IPCDato = {
    fecha: string
    inflacion: number
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const desde = searchParams.get('desde')
    const hasta = searchParams.get('hasta')

    // Solo API 2: Más limpia y confiable
    const apiUrl = 'https://api.argentinadatos.com/v1/finanzas/indices/inflacion'

    console.log('🔍 Obteniendo datos de IPC...')
    
    try {
        const response = await axios.get(apiUrl, { timeout: 30000 })
        console.log('✅ API respondió correctamente')
        
        // Los datos ya vienen limpios: [{fecha: "YYYY-MM-DD", valor: number}]
        const datosApi = response.data as Array<{fecha: string, valor: number}>
        
        // Convertir al formato que espera getIpc()
        const inflacionMensual: IPCDato[] = datosApi
            .filter(item => item.fecha && item.valor != null && isFinite(item.valor))
            .map(item => {
                // Convertir fecha de "YYYY-MM-DD" a "YYYY-MM-01" (primer día del mes)
                const fechaOriginal = new Date(item.fecha)
                const fechaPrimerDia = `${fechaOriginal.getFullYear()}-${String(fechaOriginal.getMonth() + 1).padStart(2, '0')}-01`
                
                return {
                    fecha: fechaPrimerDia,
                    inflacion: item.valor // Ya es la inflación directa, no necesita cálculo
                }
            })

        // Filtrar por fechas si se especifican
        const datosFiltrados = desde || hasta ? 
            inflacionMensual.filter((item) => {
                const añoMes = item.fecha.substring(0, 7)
                const dentroDesde = !desde || añoMes >= desde
                const dentroHasta = !hasta || añoMes <= hasta
                return dentroDesde && dentroHasta
            }) : inflacionMensual

        console.log('✅ Datos procesados:', datosFiltrados.length, 'registros válidos')

        // Calcular inflación acumulada (opcional para compatibilidad)
        const inflacionAcumulada = datosFiltrados.reduce((acc, item) => acc + item.inflacion, 0)

        return NextResponse.json({
            inflacionMensual: datosFiltrados,
            inflacionAcumulada: parseFloat(inflacionAcumulada.toFixed(2))
        })
        
    } catch (error) {
        console.error('❌ Error al obtener datos de IPC:', error)
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}