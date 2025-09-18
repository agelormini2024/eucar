import { formatCurrency } from "@/src/utils";
import { ReciboFormValues, ReciboFormSetValues } from "@/src/types/recibo";

type ReciboAmountsProps = {
    formValues: ReciboFormValues;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFormValues: ReciboFormSetValues;
};

export default function ReciboAmounts({ formValues, handleInputChange, setFormValues }: ReciboAmountsProps) {
    return (
        <div className="space-y-4">
            {/* Estado y Fecha */}
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2 text-center text-xl">
                    <label className="text-slate-800 font-bold" htmlFor="estadoReciboId">
                        Estado del Recibo :
                    </label>
                    <input
                        id="estadoReciboId"
                        type="text"
                        name="estadoReciboId"
                        onChange={handleInputChange}
                        value={formValues.estadoRecibo || ""}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold text-center uppercase"
                        disabled
                    />
                </div>
                <div className="space-y-2 text-center text-xl">
                    <label className="text-slate-800 font-bold" htmlFor="fechaPendiente">
                        Fecha :
                    </label>
                    <input
                        id="fechaPendiente"
                        type="date"
                        name="fechaPendiente"
                        onChange={(e) => setFormValues({ fechaPendiente: e.target.value })}
                        value={formValues.fechaPendiente}
                        className="block w-full p-3 bg-slate-200 text-center"
                        disabled
                    />
                </div>
            </div>

            {/* Montos */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 w-full max-w-lg text-center">
                    <label className="text-slate-800 font-bold" htmlFor="montoAnterior">
                        Ultimo monto Recibido :
                    </label>
                    <input
                        id="montoAnterior"
                        type="text"
                        name="montoAnterior"
                        onChange={handleInputChange}
                        value={formatCurrency(formValues.montoAnterior)}
                        className="block w-full p-3 bg-slate-200 text-3xl font-black text-center text-slate-500"
                        disabled
                    />
                </div>

                <div className="space-y-2 w-full max-w-lg text-center">
                    <label className="text-slate-800 font-bold" htmlFor="montoTotal">
                        Monto a Recibir :
                    </label>
                    <input
                        id="montoTotal"
                        type="text"
                        name="montoTotal"
                        onChange={handleInputChange}
                        value={formatCurrency(formValues.montoTotal)}
                        className="block w-full p-3 bg-slate-200 text-3xl font-black text-center"
                    />
                </div>
            </div>
        </div>
    );
}