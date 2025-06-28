import { NextRequest, NextResponse } from 'next/server'
import https from 'https'
import fs from 'fs'
import path from 'path'
import os from 'os'
import xlsx from 'node-xlsx'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const fecha = searchParams.get('fecha')

    if (!fecha || typeof fecha !== 'string') {
        return NextResponse.json({ error: 'Debe enviar una fecha en formato YYYY-MM-DD' }, { status: 400 })
    }

    const anno = fecha.substring(0, 4)
    const url = `https://www.bcra.gob.ar/Pdfs/PublicacionesEstadisticas/ICL${anno}.xls`
    const rutaTemp = path.join(os.tmpdir(), `icl_${anno}.xls`)
    const agent = new https.Agent({ rejectUnauthorized: false })

    // Descarga el archivo solo si no existe
    if (!fs.existsSync(rutaTemp)) {
        await new Promise((resolve, reject) => {
            const file = fs.createWriteStream(rutaTemp)
            https.get(url, { agent }, (response) => {
                response.pipe(file)
                file.on('finish', () => {
                    file.close()
                    resolve(true)
                })
            }).on('error', (err) => {
                fs.unlink(rutaTemp, () => { })
                file.close()
                reject(err)
            })
        })
    } else {
        console.log("Archivo ya existe:", rutaTemp);
    }

    try {
        // Procesar el archivo descargado
        if (!fs.existsSync(rutaTemp)) {
            return NextResponse.json({ error: `El archivo icl_${anno}.xls no existe en la carpeta temporal` }, { status: 500 })
        }
console.log('Entramos a ICL .........', anno)
        // Leer el archivo
        const buffer = fs.readFileSync(rutaTemp)
        const sheets = xlsx.parse(buffer)
        const rows = sheets[0]?.data || []
        //**---------------------------------------- */

        const filas = rows.slice(26) // Primera fila con datos es "la número 26"
        const datos: { fecha: string, indice: number }[] = []
        for (const fila of filas) {
            const fechaStr = fila[7]
            const indice = fila[8]

            // Solo agregamos si ambos valores existen y el índice es un número
            if (fechaStr && typeof !isNaN(indice)) {
                // Si la fecha está en formato "YYYYMMDD", la convertimos a "YYYY-MM-DD"
                let fecha: string

                if (typeof fechaStr === "string") {
                    const anio = fechaStr.slice(0, 4)
                    const mes = fechaStr.slice(4, 6)
                    const dia = fechaStr.slice(6, 8)
                    fecha = `${anio}-${mes}-${dia}`
                } else {
                    fecha = String(fechaStr)
                    const anio = fecha.slice(0, 4)
                    const mes = fecha.slice(4, 6)
                    const dia = fecha.slice(6, 8)
                    fecha = `${anio}-${mes}-${dia}`
                }

                datos.push({ fecha, indice })
            }
        }
        // console.log(datos)
        //**---------------------------------------- */

        if (!sheets) {
            return NextResponse.json({ error: `El archivo icl_${anno}.xls no se puede leer en la carpeta temporal` }, { status: 500 })
        }

        // Limpieza opcional: borra el archivo después de procesar
        fs.unlinkSync(rutaTemp)

        return NextResponse.json({
            datos , // Reemplaza por el valor real
        }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}