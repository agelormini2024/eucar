import { ReciboFormSetValues, ReciboFormValues } from "@/src/types/recibo";

/**
 * Utilidades para el manejo de formularios de recibos
 */

/**
 * Parsea el valor de un input según su tipo
 * @param type - Tipo del input (checkbox, number, text, etc.)
 * @param name - Nombre del campo
 * @param value - Valor del input
 * @returns Valor parseado según el tipo
 */
export function parseFormValue(
    type: string,
    name: string,
    value: string
): string | number | boolean {
    if (
        type === "number" ||
        name === "contratoId" ||
        name === "estadoReciboId"
    ) {
        return Number(value);
    } else {
        return value;
    }
}

/**
 * Maneja el cambio de un input del formulario de recibo
 * @param e - Evento del input
 * @param setFormValues - Función para actualizar el store
 */
export function handleReciboInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    setFormValues: ReciboFormSetValues
) {
    const { name, type, value } = e.target as HTMLInputElement;

    let parsedValue: string | number | boolean;

    if (type === "checkbox") {
        parsedValue = (e.target as HTMLInputElement).checked;
    } else if (
        type === "number" ||
        name === "contratoId" ||
        name === "estadoReciboId"
    ) {
        parsedValue = Number(value);
    } else {
        parsedValue = value;
    }

    setFormValues({ [name]: parsedValue } as Partial<ReciboFormValues>);
}