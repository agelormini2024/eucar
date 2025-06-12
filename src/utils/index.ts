export function formatCurrency(amount: number) {
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    })
}

export function formatFecha(fecha: Date) {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}-${mes}-${anio}`;
}

export function formatFechaIcl(fecha: Date) {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${anio}-${mes}-${dia}`;
}


export function formatFechaIpc(fecha: Date) {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${anio}-${mes}`;
}

export function restarUnMes(fecha: string): string { // restarUnMes("2025-06-10")); // "2025-05-10"
    const fechaObj = new Date(fecha);
    fechaObj.setMonth(fechaObj.getMonth() - 1);
    const yyyy = fechaObj.getFullYear();
    const mm = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export function sumarUnMes(fecha: string): string { // restarUnMes("2025-06-10")); // "2025-05-10"
    const fechaObj = new Date(fecha);
    fechaObj.setMonth(fechaObj.getMonth() + 1);
    const yyyy = fechaObj.getFullYear();
    const mm = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
