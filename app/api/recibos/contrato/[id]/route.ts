import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
    const contrato = await prisma.contrato.findFirst({
        where: {
            id: Number(id)
        }
    });
    return NextResponse.json(contrato);
}