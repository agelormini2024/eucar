"use client";
import { consultaRecibos } from "@/src/types";
import { Prisma } from "@prisma/client";
import jsPDF from "jspdf";
import ButtonGoBack from "../ui/ButtonGoBack";

type ImprimirReciboProps = {
    recibo: Prisma.ReciboGetPayload<typeof consultaRecibos>
}

export default function ImprimirRecibo({ recibo }: ImprimirReciboProps) {

    const generarPdf = async (id: number) => {

        // TODO: Aquí modificar la fechaImpreso en la tabla Recibo

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


            <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-lg p-10 flex flex-col space-y-4 mb-10">

                <section className="flex flex-row justify-between mb-8 bg-white p-4 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold">
                        {recibo.estadoReciboId === 1 ? "RECIBO PROVISORIO" : "RECIBO OFICIAL"}
                    </h1>
                    <h2 className="text-xl">Número:</h2><span className="text-2xl font-bold">{recibo.id.toString().padStart(8, '0')} </span>
                </section>

                <section className="space-y-4 bg-white p-4 rounded-lg shadow-lg">
                    <div className="text-2xl font-bold mt-4">
                        {`${recibo.contrato.clienteInquilino.apellido} ${recibo.contrato.clienteInquilino.nombre} ( ${recibo.contrato.clienteInquilino.cuit} )`}
                    </div>
                    <div className="text-2xl">
                        Propiedad:  <span className="font-bold">{`${recibo.contrato.propiedad.calle} ${recibo.contrato.propiedad.numero} ${recibo.contrato.propiedad.piso} ${recibo.contrato.propiedad.departamento}`}</span>
                    </div>
                    <div className="text-2xl">
                        Monto Total: <span className="font-bold">{` $ ${recibo.montoTotal ? recibo.montoTotal : recibo.montoAnterior}`}</span>
                    </div>
                    <div className="text-2xl">
                        Fecha: <span className="font-bold">
                            {recibo.fechaGenerado ? new Date(recibo.fechaGenerado).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                    <div className="text-2xl">
                        {recibo.fechaImpreso ? new Date(recibo.fechaImpreso).toLocaleDateString() : 'N/A'}
                    </div>
                </section>

                <button className="mt-4 uppercase text-lg bg-red-700 text-white px-4 py-2 font-bold rounded hover:bg-red-500 transition-colors duration-400"
                    onClick={() => generarPdf(recibo.id)}
                >
                    Generar PDF
                </button>
            </div>
        </>
    )
}
