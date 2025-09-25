"use client"

import { useEffect } from 'react'
import useRecibosFormStore, { ItemRecibo } from '@/src/stores/storeRecibos'

export default function ItemsSection() {
    const { formValues, addItem, removeItem, updateItem, setFormValues } = useRecibosFormStore()
    const { items } = formValues

    const handleUpdateItem = (index: number, field: keyof ItemRecibo, value: string | number) => {
        const updatedItem = { ...items[index], [field]: value }
        updateItem(index, updatedItem)
    }

    const totalItems = items.reduce((sum, item) => sum + (item.monto || 0), 0)

    // Actualizar montoPagado automáticamente cuando cambien los ítems
    useEffect(() => {
        setFormValues({ montoPagado: totalItems })
    }, [totalItems, setFormValues])

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Ítems del Recibo</h3>
                <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-1.5 bg-blue-500 font-bold text-white rounded hover:bg-blue-600"
                >
                    Agregar Ítem
                </button>
            </div>

            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center p-3 bg-red-100 border rounded">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Descripción"
                                value={item.descripcion}
                                onChange={(e) => handleUpdateItem(index, 'descripcion', e.target.value)}
                                className="w-full bg-slate-200 p-2 border rounded"
                                disabled={index === 0} // El primer ítem (Alquiler) no se puede editar la descripción
                            />
                        </div>
                        <div className="w-32">
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Monto"
                                value={item.monto || ''}
                                onChange={(e) => handleUpdateItem(index, 'monto', Number(e.target.value))}
                                className="w-full p-2 border rounded font-bold text-right bg-slate-200"
                            />
                        </div>
                        {index > 0 && ( // No permitir eliminar el primer ítem (Alquiler)
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="px-3 py-1 font-bold bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-gray-100 p-3 rounded">
                <div className="flex justify-between items-center font-bold">
                    <span>Total a Cobrar:</span>
                    <span className={`text-3xl ${totalItems >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${totalItems.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    )
}