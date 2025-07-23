import ImprimirRecibo from "@/components/recibos/ImprimirRecibo";
import { prisma } from "@/src/lib/prisma";

export default async function ImprimirReciboPage({ params }: { params: { id: string } }) {

    // Actualizar fechaImpreso en la tabla recibos

    if (!params.id || isNaN(Number(params.id))) {
        return <div className="text-center py-10">ID inválido</div>;
    }

    try {
        const recibo = await prisma.recibo.findFirst({
            where: { id: Number(params.id) }
        })
        if (!recibo) {
            return <div className="text-center py-10">Recibo no encontrado</div>;
        }
        if (recibo.estadoReciboId !== 3) {
            const fechaImpreso = new Date().toISOString();
            await prisma.recibo.update({
                where: { id: Number(params.id) },
                data: {
                    fechaImpreso,
                    estadoReciboId: 3 // Cambiar a "Impreso"
                }
            });
        }

    } catch (error) {
        console.error("Error al actualizar la fecha de impresión:", error);
    }
    return <ImprimirRecibo reciboId={params.id} />;
}