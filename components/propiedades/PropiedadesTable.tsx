"use client";
;
import Link from "next/link";
import { useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import { PropiedadesConRelaciones } from "@/src/types";


type PropiedadesTableProps = {
    data: PropiedadesConRelaciones[]; // Cambia el tipo de datos según tu modelo
}

export default function PropiedadesTable({ data }: PropiedadesTableProps) {

    // Define las columnas de la tabla
    const columns = useMemo<MRT_ColumnDef<PropiedadesConRelaciones>[]>(
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
                accessorKey: "descripcion",
                header: "Descripción",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "tipoPropiedad.nombre",
                header: "Tipo de Propiedad",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                id: "cliente", // ID único para la columna
                header: "Cliente", // Título de la columna
                Cell: ({ row }) => (
                    <span>
                        {row.original.cliente.nombre} {row.original.cliente.apellido}
                    </span>
                ),
                muiTableHeadCellProps: { style: { color: "darkred" } },
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
                accessorKey: "calle",
                header: "Calle",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "numero",
                header: "Número",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "ambientes",
                header: "Ambientes",
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
    )
}
