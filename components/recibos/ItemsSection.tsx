"use client"

import { useEffect } from 'react'
import useRecibosFormStore, { ItemRecibo } from '@/src/stores/storeRecibos'
import { esItemAlquiler, puedeEliminarItem, puedeModificarItem, getColorItem } from '@/src/utils/itemHelpers'

type ItemsSectionProps = {
    readOnly?: boolean
}

export default function ItemsSection({ readOnly = false }: ItemsSectionProps) {
    const { formValues, addItem, removeItem, updateItem, setFormValues } = useRecibosFormStore()
    const { items } = formValues

    const handleUpdateItem = (index: number, field: keyof ItemRecibo, value: string | number) => {
        const updatedItem = { ...items[index], [field]: value }
        updateItem(index, updatedItem)
    }

    const totalItems = items.reduce((sum, item) => sum + (item.monto || 0), 0)

    // Actualizar montoPagado automáticamente cuando cambien los ítems
    // Solo si NO es un recibo ya generado/impreso
    useEffect(() => {
        if (formValues.estadoReciboId > 1) {
            // Es un recibo generado/impreso, no actualizar automáticamente
            return;
        }
        setFormValues({ montoPagado: totalItems })
    }, [totalItems, setFormValues, formValues.estadoReciboId])

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Ítems del Recibo</h3>
                {!readOnly && (
                    <button
                        type="button"
                        onClick={addItem}
                        className="px-4 py-1.5 bg-blue-500 font-bold text-white rounded hover:bg-blue-600"
                    >
                        Agregar Ítem
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {items.map((item, index) => {
                    // Usar helpers para determinar tipo de item
                    const isAlquiler = esItemAlquiler(item);
                    const esModificable = puedeModificarItem(item);
                    const esEliminable = puedeEliminarItem(item);
                    const color = getColorItem(item);
                    
                    // Map de colores a clases de Tailwind
                    const colorClasses: Record<string, string> = {
                        red: 'bg-red-100 border-red-300',
                        green: 'bg-green-100 border-green-300',
                        yellow: 'bg-yellow-100 border-yellow-300',
                        blue: 'bg-blue-100 border-blue-300',
                        violet: 'bg-purple-100 border-purple-300',
                        gray: 'bg-gray-100 border-gray-300'
                    };
                    
                    return (
                        <div key={index} className={`flex gap-3 items-center p-3 border rounded ${colorClasses[color] || 'bg-red-100 border-red-300'}`}>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    value={item.descripcion}
                                    onChange={(e) => handleUpdateItem(index, 'descripcion', e.target.value)}
                                    className="w-full bg-slate-200 p-2 border rounded"
                                    disabled={readOnly || !esModificable} // Combinar readOnly con helper
                                />
                            </div>
                            <div className="w-32">
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder={isAlquiler ? "Monto" : "ej: 1500.00"}
                                    value={item.monto || ''}
                                    onChange={(e) => handleUpdateItem(index, 'monto', Number(e.target.value))}
                                    className={`w-full p-2 border rounded font-bold text-right ${
                                        !esModificable ? 'bg-slate-200' :
                                        item.monto < 0 ? 'bg-red-100 text-red-700' : 'bg-slate-200'
                                    }`}
                                    disabled={readOnly || !esModificable} // Combinar readOnly con helper
                                />
                            </div>
                            {!readOnly && esEliminable && ( // Solo mostrar botón si NO es readOnly
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="px-3 py-1 font-bold bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Totalizador Simple */}
            <div className="bg-gray-100 p-4 rounded border-2 border-gray-300">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-700">Total a Cobrar:</span>
                    <span className="text-3xl font-black text-green-600">
                        ${totalItems.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    )
}