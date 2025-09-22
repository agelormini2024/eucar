"use client";
import Link from "next/link";
import { useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import { PropiedadesConRelaciones } from "@/src/types/propiedad";


type PropiedadesTableProps = {
    data: PropiedadesConRelaciones[];
}

export default function PropiedadesTable({ data }: PropiedadesTableProps) {

    // Define las columnas de la tabla
    const columns = useMemo<MRT_ColumnDef<PropiedadesConRelaciones>[]>(
        () => [
            {
                id: "acciones", // ID único para la columna
                header: "",
                size: 80,
                Cell: ({ row }) => (
                    <Link
                        href={`${row.original.id}/edit`} // Ruta dinámica basada en el ID del cliente
                        className="bg-slate-700 text-white font-bold px-4 py-2 rounded hover:bg-red-600 transition-colors duration-400"
                        title="Editar propiedad"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>

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

                accessorKey: "tipoPropiedad.descripcion",
                header: "Tipo de Propiedad",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                id: "cliente", // ID único para la columna
                header: "Cliente", // Título de la columna
                accessorFn: (row) => `${row.cliente.nombre} ${row.cliente.apellido}`, // Combina los valores de calle y número
                Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Renderiza el valor combinado
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
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
                accessorKey: "piso",
                header: "Piso",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "departamento",
                header: "Departamento",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "localidad",
                header: "Localidad",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "provincia.nombre",
                header: "Provincia",
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
        enableStickyHeader: true,
        muiTablePaperProps: {
            elevation: 5, //change the mui box shadow
            //customize paper styles
            sx: {
                '& tr:nth-of-type(odd) > td': {
                    backgroundColor: '#f5f5f5',
                },
            },
        },
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
