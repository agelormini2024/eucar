/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import useRecibosFormStore, { ItemRecibo } from '../src/stores/storeRecibos'

// Helper para resetear el store antes de cada test
const resetStore = () => {
    useRecibosFormStore.getState().resetForm()
}

describe('useRecibosFormStore - Items Management', () => {
    beforeEach(() => {
        resetStore()
    })

    describe('Estado inicial', () => {
        it('Debería inicializar con array vacío de items (se cargarán desde hook o BD)', () => {
            const { result } = renderHook(() => useRecibosFormStore())
            
            // CAMBIO: Ahora el estado inicial es un array vacío
            // Los items se cargan desde useReciboValidation o desde la BD
            expect(result.current.formValues.items).toEqual([])
        })
    })

    describe('addItem', () => {
        it('Debería agregar un nuevo ítem EXTRA vacío al final del array', () => {
            const { result } = renderHook(() => useRecibosFormStore())

            act(() => {
                result.current.addItem()
            })

            // CAMBIO: Ahora incluye tipoItemId: 3 (EXTRA)
            expect(result.current.formValues.items).toEqual([
                { descripcion: "", monto: 0, tipoItemId: 3 }
            ])
        })

        it('Debería poder agregar múltiples ítems', () => {
            const { result } = renderHook(() => useRecibosFormStore())

            act(() => {
                result.current.addItem()
                result.current.addItem()
            })

            expect(result.current.formValues.items).toHaveLength(2)
            expect(result.current.formValues.items).toEqual([
                { descripcion: "", monto: 0, tipoItemId: 3 },
                { descripcion: "", monto: 0, tipoItemId: 3 }
            ])
        })
    })

    describe('removeItem', () => {
        it('Debería eliminar el ítem en el índice especificado', () => {
            const { result } = renderHook(() => useRecibosFormStore())

            // Agregar algunos ítems primero
            act(() => {
                result.current.addItem()
                result.current.addItem()
                result.current.addItem()
            })

            // Eliminar el ítem del medio (índice 1)
            act(() => {
                result.current.removeItem(1)
            })

            expect(result.current.formValues.items).toHaveLength(2)
            expect(result.current.formValues.items).toEqual([
                { descripcion: "", monto: 0, tipoItemId: 3 },
                { descripcion: "", monto: 0, tipoItemId: 3 }
            ])
        })

        it('No debería afectar otros ítems al eliminar uno específico', () => {
            const { result } = renderHook(() => useRecibosFormStore())

            // Configurar ítems con datos específicos
            act(() => {
                result.current.setFormValues({
                    items: [
                        { descripcion: "Alquiler", monto: 400000 },
                        { descripcion: "Expensas", monto: 50000 },
                        { descripcion: "ABL", monto: 15000 }
                    ]
                })
            })

            // Eliminar el ítem del medio
            act(() => {
                result.current.removeItem(1)
            })

            expect(result.current.formValues.items).toEqual([
                { descripcion: "Alquiler", monto: 400000 },
                { descripcion: "ABL", monto: 15000 }
            ])
        })
    })

    describe('updateItem', () => {
        it('Debería actualizar el ítem en el índice especificado', () => {
            const { result } = renderHook(() => useRecibosFormStore())

            // Primero agregar un ítem
            act(() => {
                result.current.addItem()
            })

            const nuevoItem: ItemRecibo = { descripcion: "Expensas", monto: 50000, tipoItemId: 2 }

            act(() => {
                result.current.updateItem(0, nuevoItem)
            })

            expect(result.current.formValues.items[0]).toEqual(nuevoItem)
        })

        it('Debería mantener otros ítems sin cambios al actualizar uno específico', () => {
            const { result } = renderHook(() => useRecibosFormStore())

            // Configurar múltiples ítems
            act(() => {
                result.current.setFormValues({
                    items: [
                        { descripcion: "Alquiler", monto: 400000 },
                        { descripcion: "Expensas", monto: 50000 },
                        { descripcion: "ABL", monto: 15000 }
                    ]
                })
            })

            // Actualizar solo el ítem del medio
            const itemActualizado: ItemRecibo = { descripcion: "Expensas Extraordinarias", monto: 75000 }
            
            act(() => {
                result.current.updateItem(1, itemActualizado)
            })

            expect(result.current.formValues.items).toEqual([
                { descripcion: "Alquiler", monto: 400000 },
                { descripcion: "Expensas Extraordinarias", monto: 75000 },
                { descripcion: "ABL", monto: 15000 }
            ])
        })

        it('Debería poder actualizar solo la descripción de un ítem', () => {
            const { result } = renderHook(() => useRecibosFormStore())

            // Agregar un ítem primero
            act(() => {
                result.current.addItem()
            })

            const itemOriginal = result.current.formValues.items[0]
            const itemActualizado: ItemRecibo = { ...itemOriginal, descripcion: "Alquiler Mensual" }

            act(() => {
                result.current.updateItem(0, itemActualizado)
            })

            expect(result.current.formValues.items[0]).toEqual({
                descripcion: "Alquiler Mensual",
                monto: 0,
                tipoItemId: 3
            })
        })

        it('Debería poder actualizar solo el monto de un ítem', () => {
            const { result } = renderHook(() => useRecibosFormStore())

            // Agregar un ítem primero
            act(() => {
                result.current.addItem()
            })

            const itemOriginal = result.current.formValues.items[0]
            const itemActualizado: ItemRecibo = { ...itemOriginal, monto: 450000 }

            act(() => {
                result.current.updateItem(0, itemActualizado)
            })

            expect(result.current.formValues.items[0]).toEqual({
                descripcion: "",
                monto: 450000,
                tipoItemId: 3
            })
        })
    })

    describe('resetForm', () => {
        it('Debería resetear los ítems a array vacío (sin items por defecto)', () => {
            const { result } = renderHook(() => useRecibosFormStore())

            // Modificar el estado primero
            act(() => {
                result.current.setFormValues({
                    items: [
                        { descripcion: "Alquiler", monto: 400000, tipoItemId: 1 },
                        { descripcion: "Expensas", monto: 50000, tipoItemId: 2 },
                        { descripcion: "ABL", monto: 15000, tipoItemId: 3 }
                    ]
                })
            })

            // Resetear
            act(() => {
                result.current.resetForm()
            })

            // CAMBIO: Ahora resetea a array vacío, no a item Alquiler
            expect(result.current.formValues.items).toEqual([])
        })
    })

    describe('setFormValues con ítems', () => {
        it('Debería poder establecer un array completo de ítems', () => {
            const { result } = renderHook(() => useRecibosFormStore())

            const nuevosItems: ItemRecibo[] = [
                { descripcion: "Alquiler", monto: 400000 },
                { descripcion: "Diferencia IPC", monto: 20000 },
                { descripcion: "Expensas", monto: 50000 }
            ]

            act(() => {
                result.current.setFormValues({ items: nuevosItems })
            })

            expect(result.current.formValues.items).toEqual(nuevosItems)
        })

        it('Debería mantener otros valores del formulario al actualizar solo ítems', () => {
            const { result } = renderHook(() => useRecibosFormStore())

            // Establecer algunos valores iniciales
            act(() => {
                result.current.setFormValues({
                    contratoId: 123,
                    montoTotal: 500000,
                    observaciones: "Test"
                })
            })

            // Actualizar solo ítems
            act(() => {
                result.current.setFormValues({
                    items: [{ descripcion: "Alquiler", monto: 400000 }]
                })
            })

            expect(result.current.formValues.contratoId).toBe(123)
            expect(result.current.formValues.montoTotal).toBe(500000)
            expect(result.current.formValues.observaciones).toBe("Test")
            expect(result.current.formValues.items).toEqual([
                { descripcion: "Alquiler", monto: 400000 }
            ])
        })
    })
});