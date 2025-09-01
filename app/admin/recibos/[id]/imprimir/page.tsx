import ImprimirRecibo from "@/components/recibos/ImprimirRecibo";
import { prisma } from "@/src/lib/prisma";

interface SegmentParams {
    id: string
}

export default async function ImprimirReciboPage({ params }: { params: Promise<(SegmentParams)> }) {

    // Actualizar fechaImpreso en la tabla recibos
    const { id } = await params

    if (!id || isNaN(Number(id))) {
        return <div className="text-center py-10">ID inválido</div>;
    }

    try {
        const recibo = await prisma.recibo.findFirst({
            where: { id: Number(id) }
        })
        if (!recibo) {
            return <div className="text-center py-10">Recibo no encontrado</div>;
        }
        if (recibo.estadoReciboId === 2) {
            const fechaImpreso = new Date().toISOString();
            await prisma.recibo.update({
                where: { id: Number(id) },
                data: {
                    fechaImpreso,
                    estadoReciboId: 3 // Cambiar a "Impreso"
                }
            });
        }

    } catch (error) {
        console.error("Error al actualizar la fecha de impresión:", error);
    }

    return <ImprimirRecibo reciboId={id} />;
}