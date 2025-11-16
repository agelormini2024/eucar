import { ReciboFormValues } from "@/src/types/recibo";

type ReciboServicesProps = {
    formValues: ReciboFormValues;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    readOnly?: boolean;
};

const services = [
    { name: 'expensas', label: 'Expensas' },
    { name: 'abl', label: 'ABL' },
    { name: 'aysa', label: 'AYSA' },
    { name: 'luz', label: 'Luz' },
    { name: 'gas', label: 'Gas' },
    { name: 'otros', label: 'Otros' }
] as const;

export default function ReciboServices({ formValues, handleInputChange, readOnly = false }: ReciboServicesProps) {
    return (
        <div className="grid lg:grid-cols-2 gap-4 mt-4 mb-4">
            <div className="grid lg:grid-cols-2 gap-4">
                {services.map(service => (
                    <div key={service.name} className="space-y-2">
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor={service.name}
                        >
                            {service.label} :
                        </label>
                        <input
                            id={service.name}
                            type="checkbox"
                            name={service.name}
                            className="align-middle ml-2"
                            onChange={handleInputChange}
                            checked={formValues[service.name] || false}
                            disabled={readOnly}
                        />
                    </div>
                ))}
            </div>
            
            <div className="grid lg:grid-cols-1 gap-4">
                <div>
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="observaciones"
                    >
                        Observaciones :
                    </label>
                    <textarea
                        id="observaciones"
                        name="observaciones"
                        onChange={handleInputChange}
                        value={formValues.observaciones || ''}
                        className="block w-full p-6 bg-slate-200 mt-2"
                        placeholder="Observaciones del Recibo"
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );
}