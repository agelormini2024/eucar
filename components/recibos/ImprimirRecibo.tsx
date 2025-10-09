"use client";
import { pdf } from "@react-pdf/renderer";
import ButtonGoBack from "../ui/ButtonGoBack";
import PDFRecibo from "./PDFRecibo";
import { ReciboConRelaciones } from "@/src/types/recibo";
import { formatCurrency, formatFecha } from "@/src/utils";

type ImprimirReciboProps = {
    recibo: ReciboConRelaciones;
};

export default function ImprimirRecibo({ recibo }: ImprimirReciboProps) {

    const handleOpenPdf = async () => {
        try {
            const blob = await pdf(<PDFRecibo recibo={recibo} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (error) {
            console.error("Error al generar PDF:", error);
            alert("Error al generar el PDF. Intente nuevamente.");
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto bg-orange-50 rounded-lg shadow-lg p-10 flex flex-col space-y-4 mb-10">

                <section className="flex flex-row justify-between mb-8 bg-white p-4 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold">
                        {recibo.estadoReciboId === 1 ? "RECIBO PROVISORIO" : "RECIBO OFICIAL"}
                    </h1>
                    <h2 className="text-xl">Número:</h2><span className="text-2xl font-bold">{recibo.id.toString().padStart(8, '0')} </span>
                </section>

                <section className="space-y-4 bg-white p-4 rounded-lg shadow-lg">

                    <div className="text-xl mt-4">
                        Inquilino : <span className="text-2xl font-bold text-cyan-800">
                            {`${recibo.contrato.clienteInquilino.apellido} ${recibo.contrato.clienteInquilino.nombre} ( ${recibo.contrato.clienteInquilino.cuit} )`}</span>
                    </div>
                    <div className="text-xl">
                        Propiedad :  <span className="text-2xl font-bold text-cyan-800">{`${recibo.contrato.propiedad.calle} ${recibo.contrato.propiedad.numero} ${recibo.contrato.propiedad.piso} ${recibo.contrato.propiedad.departamento}`}</span>
                    </div>
                    <div className="text-xl">
                        Fecha Generado : <span className="text-xl font-bold text-cyan-800">
                            {recibo.fechaGenerado ? formatFecha(new Date(recibo.fechaGenerado)) : 'N/A'}
                        </span>
                    </div>
                    <div className="text-xl">
                        Fecha Impreso : <span className="text-xl font-bold text-cyan-800">
                            {recibo.fechaImpreso ? formatFecha(new Date(recibo.fechaImpreso)) : 'N/A'}
                        </span>
                    </div>
                    <div className="text-2xl">
                        Monto Total : <span className="font-bold text-3xl text-red-900">{`${recibo.montoTotal ? formatCurrency(recibo.montoTotal) : formatCurrency(recibo.montoAnterior)}`}</span>
                    </div>

                </section>

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={handleOpenPdf}
                        className="mt-4 uppercase bg-slate-800 text-white px-4 py-2 font-bold rounded hover:bg-cyan-800 transition-colors duration-400 cursor-pointer w-48"
                    >
                        Imprimir PDF
                    </button>
                    <ButtonGoBack />
                </div>

            </div>
        </>
    )
}