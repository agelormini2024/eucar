"use client"

import { RecibosConRelaciones } from "@/src/types"


type RecibosTableProps = {
    data: RecibosConRelaciones[]
}
export default function RecibosTable({data}: RecibosTableProps) {
    console.log(data)

    return (
        <div>RecibosTable</div>
    )
}
