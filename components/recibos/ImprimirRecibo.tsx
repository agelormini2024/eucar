"use client";
import { consultaRecibos } from "@/src/types";
import { Prisma } from "@prisma/client";
import jsPDF from "jspdf";
import { useEffect } from "react";

type ImprimirReciboProps = {
    recibo: Prisma.ReciboGetPayload<typeof consultaRecibos>
}

export default function ImprimirRecibo({ recibo }: ImprimirReciboProps) {

    const generarPdf = async (id: number) => {
        const pdfContent = new jsPDF()
        pdfContent.text(`Recibo ID: ${recibo.id}`, 10, 10)
        pdfContent.text(`Cliente: ${recibo.contrato.clienteInquilino.apellido} ${recibo.contrato.clienteInquilino.nombre}`, 10, 20)
        pdfContent.text(`Cuit: ${recibo.contrato.clienteInquilino.cuit}`, 10, 30)
        pdfContent.text(`Propiedad: ${recibo.contrato.propiedad.calle} ${recibo.contrato.propiedad.numero} ${recibo.contrato.propiedad.piso} ${recibo.contrato.propiedad.departamento}`, 10, 40)
        pdfContent.text(`Monto Total: ${recibo.montoTotal ? recibo.montoTotal : recibo.montoAnterior}`, 10, 50)
        pdfContent.text(`Fecha Generado: ${recibo.fechaGenerado ? new Date(recibo.fechaGenerado).toLocaleDateString() : 'N/A'}`, 10, 60)
        pdfContent.text(`Fecha Impreso: ${recibo.fechaImpreso ? new Date(recibo.fechaImpreso).toLocaleDateString() : 'N/A'}`, 10, 70)
        // Mostrar el PDF en el navegador o descargarlo
        pdfContent.save(`recibo-${recibo.id}.pdf`)

        return recibo;
    }

    return (
        <>
            <section className="flex flex-col space-y-4">
                <div className="text-3xl font-bold justify-end">
                    {recibo.estadoReciboId === 1 ? "RECIBO PROVISORIO" : "RECIBO OFICIAL"}
                </div><span className="text-2xl"> {`Número: ${recibo.id} `} </span>
                <div className="text-2xl font-bold">
                    {`${recibo.contrato.clienteInquilino.apellido} ${recibo.contrato.clienteInquilino.nombre} ( ${recibo.contrato.clienteInquilino.cuit} )`}
                </div>
                <div className="text-2xl">
                    Propiedad:  <span className="font-bold">{`${recibo.contrato.propiedad.calle} ${recibo.contrato.propiedad.numero} ${recibo.contrato.propiedad.piso} ${recibo.contrato.propiedad.departamento}`}</span>
                </div>
                <div className="text-2xl">
                    Monto Total: <span className="font-bold">{` $ ${recibo.montoTotal ? recibo.montoTotal : recibo.montoAnterior}`}</span>
                </div>
                <div className="text-2xl">
                    {recibo.fechaGenerado ? new Date(recibo.fechaGenerado).toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-2xl">{recibo.fechaImpreso ? new Date(recibo.fechaImpreso).toLocaleDateString() : 'N/A'}</div>
            </section>

            <button className="mt-4 bg-blue-500 text-white px-4 py-2 font-bold rounded hover:bg-blue-700 transition-colors duration-400"
                onClick={() => generarPdf(recibo.id)}
            >
                Generar PDF
            </button>
        </>
    )
}
