"use client";

import { ClientesConProvinciaPais } from "@/src/types";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import Link from "next/link"; // Importar Link de Next.js
import { useMemo } from "react";

type ClientesTableProps = {
    data: ClientesConProvinciaPais[]; // Cambia el tipo de datos según tu modelo
};

export default function ClientesTable({ data }: ClientesTableProps) {
    const columns = useMemo<MRT_ColumnDef<ClientesConProvinciaPais>[]>(
        () => [
            {
                id: "acciones", // ID único para la columna
                header: "Acciones",
                Cell: ({ row }) => (
                    <Link
                        href={`${row.original.id}/edit`} // Ruta dinámica basada en el ID del cliente
                        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Editar
                    </Link>
                ),
                muiTableHeadCellProps: { style: { textAlign: "center" } },
                muiTableBodyCellProps: { style: { textAlign: "center" } },
            },
            {
                id: "cliente", // ID único para la columna
                header: "Cliente", // Título de la columna
                accessorFn: (row) => `${row.nombre} ${row.apellido}`, // Combina los valores de calle y número
                Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Renderiza el valor combinado
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                accessorKey: "razonSocial",
                header: "Razón Social",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "email",
                header: "Email",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "celular",
                header: "Celular",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                id: "direccion", // ID único para la columna
                header: "Domicilio", // Título de la columna
                accessorFn: (row) => `${row.calle} ${row.numero}`, // Combina los valores de calle y número
                Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Renderiza el valor combinado
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                accessorKey: "provincia.nombre",
                header: "Provincia",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "localidad",
                header: "Localidad",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },            
            {
                accessorKey: "activo",
                header: "Activo",
                muiTableHeadCellProps: { style: { color: "darkred" } },
                Cell: ({ cell }) => (cell.getValue<boolean>() ? "Sí" : "No"), // Renderizar "Sí" o "No" según el valor booleano

            },            
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableColumnResizing: true,
        enableColumnOrdering: true,
        enableRowNumbers: true,
        enableRowSelection: false, // Deshabilitar selección de filas si no es necesaria
    });

    return (
        <div className="m-4">
            <MaterialReactTable table={table} />
        </div>
    );
}