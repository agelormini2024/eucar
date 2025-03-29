"use client";
import { Cliente } from "@prisma/client";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import Link from "next/link"; // Importar Link de Next.js
import { useMemo } from "react";

type PruebaTableProps = {
    data: Cliente[];
};

export default function PruebaTable({ data }: PruebaTableProps) {
    const columns = useMemo<MRT_ColumnDef<Cliente>[]>(
        () => [
            {
                id: "acciones", // ID único para la columna
                header: "Acciones",
                Cell: ({ row }) => (
                    <Link
                        href={`/clientes/${row.original.id}`} // Ruta dinámica basada en el ID del cliente
                        className="bg-red-800 text-white px-4 py-1.5 rounded hover:bg-red-500"
                    >
                        Editar
                    </Link>
                ),
                muiTableHeadCellProps: { style: { textAlign: "center" } },
                muiTableBodyCellProps: { style: { textAlign: "center" } },
            },
            {
                accessorKey: "nombre",
                header: "Nombre",
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableHiding: false,
            },
            {
                accessorKey: "apellido",
                header: "Apellido",
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableHiding: false,
            },
            {
                accessorKey: "razonSocial",
                header: "Razón Social",
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableHiding: false,
            },
            {
                accessorKey: "email",
                header: "Email",
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableHiding: false,
            },
            {
                accessorKey: "celular",
                header: "Celular",
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableHiding: false,
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
        <div>
            <MaterialReactTable table={table} />
        </div>
    );
}