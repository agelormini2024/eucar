"use client";
import Switch from "@mui/material/Switch";
import { Pais, Provincia } from "@prisma/client";
import { useState } from "react";
import { useClienteFormStore } from "@/src/stores/storeClientes";

type ClienteFormDynamicProps = {
    paises: Pais[];
    provincias: Provincia[];
}

export default function ClienteFormDynamic({ paises, provincias }: ClienteFormDynamicProps) {
    const [selectedPais, setSelectedPais] = useState<string | null>(null); // Estado para el país seleccionado
    const [isActivo, setIsActivo] = useState(true) // Estado para el switch
    const { formValues, setFormValues } = useClienteFormStore()

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsActivo(event.target.checked);
    };

    const handlePaisChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPais(event.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues({ [name]: value });
    };


    // const isArgentina = paises.find((pais) => pais.id.toString() === selectedPais)?.nombre === "Argentina";
    const isArgentina = true; // Por el momento solo se permite Argentina en el caso de permitir otro pais
    // considerar la linea de arriba comentada

    return (
        <>
            <div className="space-y-2">
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="nombre"
                >Nombre :</label>
                <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    onChange={handleInputChange}
                    value={formValues.nombre}
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Nombre del Cliente"
                />
            </div>

            <div className="space-y-2">
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="apellido"
                >Apellido :</label>
                <input
                    id="apellido"
                    name="apellido"
                    onChange={handleInputChange}
                    value={formValues.apellido}
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Apellido del Cliente"
                />
            </div>
            <div className="space-y-2">
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="razonSocial"
                >Razón Social :</label>
                <input
                    id="razonSocial"
                    name="razonSocial"
                    onChange={handleInputChange}
                    value={formValues.razonSocial}
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Razón Social S.A. del Cliente"
                />
            </div>
            <div className="space-y-2">
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="cuit"
                >CUIT / CUIL :</label>
                <input
                    id="cuit"
                    name="cuit"
                    onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, ""); // Eliminar todo lo que no sea un número
                        let formateoValue = rawValue;

                        // Agregar los guiones automáticamente
                        if (rawValue.length > 2) {
                            formateoValue = `${rawValue.slice(0, 2)}-${rawValue.slice(2)}`;
                        }
                        if (rawValue.length > 10) {
                            formateoValue = `${rawValue.slice(0, 2)}-${rawValue.slice(2, 10)}-${rawValue.slice(10, 11)}`;
                        }

                        setFormValues({ cuit: formateoValue }); // Actualizar el estado global
                    }}
                    value={formValues.cuit}
                    className="block w-full p-3 bg-slate-100"
                    placeholder="12-12345678-0"
                    maxLength={13} // Limitar la longitud máxima del CUIT formateado
                />
            </div>
            <div className="space-y-2">
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="calle"
                >Calle :</label>
                <input
                    id="calle"
                    name="calle"
                    onChange={handleInputChange}
                    value={formValues.calle}
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Ingrese una calle"
                />
            </div>

            <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor="numero"
                        >Número :</label>
                        <input
                            id="numero"
                            name="numero"
                            onChange={handleInputChange}
                            value={formValues.numero}
                            className="block p-3 w-full bg-slate-100"
                            placeholder="Número"
                        />
                    </div>
                    <div>
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor="piso"
                        >Piso :</label>
                        <input
                            id="piso"
                            name="piso"
                            onChange={handleInputChange}
                            value={formValues.piso}
                            className="block p-3 w-full bg-slate-100"
                            placeholder="Ingrese un piso"
                        />
                    </div>
                    <div>
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor="departamento"
                        >Departamento :</label>
                        <input
                            id="departamento"
                            name="departamento"
                            onChange={handleInputChange}
                            value={formValues.departamento}
                            className="block p-3 w-full bg-slate-100"
                            placeholder="Ingrese un departamento"
                        />
                    </div>
                </div>
            </div>
            <div>
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="codigoPostal"
                >Código Postal :</label>
                <input
                    id="codigoPostal"
                    name="codigoPostal"
                    onChange={handleInputChange}
                    value={formValues.codigoPostal}
                    className="block p-3 bg-slate-100"
                    placeholder="Ingrese un Código"
                />
            </div>

            <div className="space-y-2">
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="localidad"
                >Localidad :</label>
                <input
                    id="localidad"
                    name="localidad"
                    onChange={handleInputChange}
                    value={formValues.localidad}
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Localidad"
                />
            </div>
            <div className="space-y-2">
                <label className="text-slate-800 font-bold"
                    htmlFor="paisId">
                    País :
                </label>
                <select
                    className="block w-full p-3 bg-slate-100"
                    id="paisId"
                    name="paisId"
                    defaultValue="1"
                    disabled={true} // Por el moment Deshabilitar este select y establecer el pais por defecto en 1 
                    onChange={handlePaisChange}
                >
                    <option value="">-- Seleccione --</option>
                    {paises.map((pais) => (
                        <option key={pais.id} value={pais.id}>
                            {pais.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-slate-800 font-bold"
                    htmlFor="provinciaId">
                    Provincia :
                </label>
                <select
                    className="block w-full p-3 bg-slate-100"
                    id="provinciaId"
                    name="provinciaId"
                    onChange={handleInputChange}
                    defaultValue={formValues.provinciaId}
                    disabled={!isArgentina} // Deshabilitar si el país no es Argentina
                >
                    <option value="">-- Seleccione --</option>
                    {provincias.map((provincia) => (
                        <option key={provincia.id} value={provincia.id}>
                            {provincia.nombre}
                        </option>
                    ))}
                </select>
            </div>


            <div className="space-y-2">
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="celular"
                >Celular :</label>
                <input
                    type="tel"
                    id="celular"
                    name="celular"
                    onChange={handleInputChange}
                    value={formValues.celular}
                    className="block w-full p-3 bg-slate-100"
                    placeholder="011-3456-7890"
                />
            </div>

            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor="telefono1"
                        >Telefono (1) :</label>
                        <input
                            type="tel"
                            id="telefono1"
                            name="telefono1"
                            onChange={handleInputChange}
                            value={formValues.telefono1}
                            className="block w-full p-3 bg-slate-100"
                            placeholder="011-3456-7890"
                        />
                    </div>
                    <div>
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor="telefono2"
                        >Telefono (2) :</label>
                        <input
                            type="tel"
                            id="telefono2"
                            name="telefono2"
                            onChange={handleInputChange}
                            value={formValues.telefono2}
                            className="block w-full p-3 bg-slate-100"
                            placeholder="011-3456-7890"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2 flex items-center">
                <label
                    className="text-slate-800 font-bold "
                    htmlFor="activo"
                >Cliente Activo :</label>
                <Switch
                    id="activo"
                    checked={isActivo}
                    onChange={handleSwitchChange}
                    color="primary" // Cambia el color del switch (opcional)
                    className="ml-4"
                />
            </div>

            <div className="space-y-2">
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="email"
                >Email :</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleInputChange}
                    value={formValues.email}
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Ingrese un email"
                />
            </div>
            <div>
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="observaciones"
                >Observaciones :</label>
                <textarea
                    id="observaciones"
                    name="observaciones"
                    onChange={handleInputChange}
                    value={formValues.observaciones}
                    className="block w-full p-5 bg-slate-100"
                    placeholder="Ingrese observaciones"
                />
            </div>
        </>
    );
}

