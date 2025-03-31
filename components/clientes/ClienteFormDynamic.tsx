"use client";
import Switch from "@mui/material/Switch";
import { Pais, Provincia } from "@prisma/client";
import { useState } from "react";

type ClienteFormDynamicProps = {
    paises: Pais[];
    provincias: Provincia[];
}

export default function ClienteFormDynamic({ paises, provincias }: ClienteFormDynamicProps) {
    const [selectedPais, setSelectedPais] = useState<string | null>(null);
    const [isActivo, setIsActivo] = useState(false); // Estado para el switch
    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsActivo(event.target.checked);
    };
    const handlePaisChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPais(event.target.value);
    };

    const isArgentina = paises.find(
        (pais) => pais.id.toString() === selectedPais
    )?.nombre === "Argentina";

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
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Ingrese un cuit o cuil"
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
                            className="block p-3 w-full bg-slate-100"
                            placeholder="Ingrese un departamento"
                        />
                    </div>
                </div>
            </div>
            <div>
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="codigo"
                >Código Postal :</label>
                <input
                    id="codigo"
                    name="codigo"
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
            <div>
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="observaciones"
                >Observaciones :</label>
                <textarea
                    id="observaciones"
                    name="observaciones"
                    className="block w-full p-5 bg-slate-100"
                    placeholder="Ingrese observaciones"
                />
            </div>

        </>
    );
}