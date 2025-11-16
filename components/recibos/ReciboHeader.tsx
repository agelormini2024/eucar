import { Contrato } from "@/src/schema";
import { ReciboFormValues } from "@/src/types/recibo";

type ReciboHeaderProps = {
    contrato: Contrato;
    formValues: ReciboFormValues;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ReciboHeader({ contrato, formValues, handleInputChange }: ReciboHeaderProps) {
    // Nota: readOnly prop removida ya que todos los campos están siempre disabled
    return (
        <div className="space-y-4">
            {/* Contrato */}
            <div className="space-y-2">
                <label className="text-slate-800 font-bold" htmlFor="contratoId">
                    Contrato :
                </label>
                <input
                    className="block w-full p-3 bg-slate-200"
                    id="contratoId"
                    name="contratoId"
                    value={contrato.descripcion}
                    disabled
                />
            </div>

            {/* Propiedad y Tipo de Contrato */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-slate-800 font-bold" htmlFor="propiedad">
                        Propiedad :
                    </label>
                    <input
                        id="propiedad"
                        type="text"
                        name="propiedad"
                        value={formValues.propiedad || ""}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold"
                        disabled
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-slate-800 font-bold" htmlFor="tipoContrato">
                        Tipo de Contrato :
                    </label>
                    <input
                        id="tipoContrato"
                        type="text"
                        name="tipoContrato"
                        onChange={handleInputChange}
                        value={formValues.tipoContrato}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold uppercase"
                        disabled
                    />
                </div>
            </div>

            {/* Propietario e Inquilino */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-slate-800 font-bold" htmlFor="clientePropietario">
                        Propietario :
                    </label>
                    <input
                        id="clientePropietario"
                        type="text"
                        name="clientePropietario"
                        onChange={handleInputChange}
                        value={formValues.clientePropietario}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold"
                        disabled
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-slate-800 font-bold" htmlFor="clienteInquilino">
                        Inquilino :
                    </label>
                    <input
                        id="clienteInquilino"
                        type="text"
                        name="clienteInquilino"
                        onChange={handleInputChange}
                        value={formValues.clienteInquilino}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold"
                        disabled
                    />
                </div>
            </div>
        </div>
    );
}