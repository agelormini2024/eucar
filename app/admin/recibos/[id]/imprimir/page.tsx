import ImprimirRecibo from "@/components/recibos/ImprimirRecibo";
import { prisma } from "@/src/lib/prisma";
import { ReciboConRelaciones } from "@/src/types/recibo";

interface SegmentParams {
    id: string
}

export default async function ImprimirReciboPage({ params }: { params: Promise<(SegmentParams)> }) {

    const { id } = await params

    if (!id || isNaN(Number(id))) {
        return <div className="text-center py-10">ID inválido</div>;
    }

    try {
        // Fetch completo del recibo con todas las relaciones
        const reciboFromDb = await prisma.recibo.findUnique({
            where: { id: Number(id) },
            include: {
                contrato: {
                    include: {
                        clienteInquilino: {
                            select: {
                                apellido: true,
                                nombre: true,
                                cuit: true,
                            }
                        },
                        clientePropietario: {
                            select: {
                                apellido: true,
                                nombre: true,
                                cuit: true,
                            }
                        },
                        propiedad: {
                            select: {
                                calle: true,
                                numero: true,
                                piso: true,
                                departamento: true,
                                tipoPropiedad: {
                                    select: {
                                        descripcion: true,
                                    }
                                }
                            }
                        },
                    }
                }
            }
        });

        if (!reciboFromDb) {
            return <div className="text-center py-10">Recibo no encontrado</div>;
        }

        // Convertir a ReciboConRelaciones con fechas como strings
        const recibo: ReciboConRelaciones = {
            ...reciboFromDb,
            fechaPendiente: reciboFromDb.fechaPendiente.toISOString(),
            fechaGenerado: reciboFromDb.fechaGenerado?.toISOString() || null,
            fechaImpreso: reciboFromDb.fechaImpreso?.toISOString() || null,
            fechaAnulado: reciboFromDb.fechaAnulado?.toISOString() || null,
            createdAt: reciboFromDb.createdAt.toISOString(),
            updatedAt: reciboFromDb.updatedAt.toISOString(),
        };

        // Actualizar fechaImpreso solo si el estado es "Generado" (2)
        if (recibo.estadoReciboId === 2) {
            const fechaImpreso = new Date().toISOString();
            await prisma.recibo.update({
                where: { id: Number(id) },
                data: {
                    fechaImpreso: new Date(fechaImpreso),
                    estadoReciboId: 3 // Cambiar a "Impreso"
                }
            });
            
            // Crear nuevo objeto con los datos actualizados
            const reciboActualizado: ReciboConRelaciones = {
                ...recibo,
                fechaImpreso,
                estadoReciboId: 3
            };
            
            return <ImprimirRecibo recibo={reciboActualizado} />;
        }

        return <ImprimirRecibo recibo={recibo} />;

    } catch (error) {
        console.error("Error al cargar o actualizar el recibo:", error);
        return <div className="text-center py-10">Error al cargar el recibo</div>;
    }
}