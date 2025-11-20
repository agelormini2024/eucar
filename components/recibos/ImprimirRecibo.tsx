"use client";
import { pdf } from "@react-pdf/renderer";
import { useRouter } from "next/navigation";
// import ButtonGoBack from "../ui/ButtonGoBack";
import PDFRecibo from "./PDFRecibo";
import { ReciboConRelaciones } from "@/src/types/recibo";
import { formatCurrency, formatFecha } from "@/src/utils";


type ImprimirReciboProps = {
    recibo: ReciboConRelaciones;
};

export default function ImprimirRecibo({ recibo }: ImprimirReciboProps) {

    const router = useRouter();

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

                    {/* Detalle de Items */}
                    {recibo.itemsRecibo && recibo.itemsRecibo.length > 0 && (
                        <div className="mt-6 border-t-2 border-slate-300 pt-4">
                            <h3 className="text-lg font-bold text-slate-700 mb-3">Detalle:</h3>
                            <div className="space-y-2">
                                {recibo.itemsRecibo.map((item, index) => (
                                    <div key={item.id || index} className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded">
                                        <span className="text-slate-700">{item.descripcion}</span>
                                        <span className="font-semibold text-slate-900">
                                            {formatCurrency(item.monto)}
                                        </span>
                                    </div>
                                ))}
                                {/* Línea separadora */}
                                <div className="border-t-2 border-slate-400 mt-3 pt-2">
                                    <div className="flex justify-between items-center px-3 py-2">
                                        <span className="text-lg font-bold text-slate-900">TOTAL</span>
                                        <span className="text-lg font-bold text-slate-900">
                                            {formatCurrency(recibo.montoPagado)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-2xl mt-4">
                        Monto Recibido : <span className="font-bold text-3xl text-red-900">{formatCurrency(recibo.montoPagado)}</span>
                    </div>

                </section>

                <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                    <input
                        type="button"
                        onClick={handleOpenPdf}
                        className='bg-red-800 hover:bg-red-600 text-white p-3 rounded-md w-full 
                    cursor-pointer font-bold uppercase mt-5 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        value="I m p r i m i r     PDF"
                    />


                    {/* <ButtonGoBack /> */}
                    <input
                        type="button"
                        className='bg-slate-800 hover:bg-slate-600 text-white p-3 rounded-md w-full 
                    cursor-pointer font-bold uppercase mt-5 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        value="Cancelar Generación"
                        onClick={() => router.push('/admin/recibos/list')}
                    />

                </div>

            </div>
        </>
    )
}