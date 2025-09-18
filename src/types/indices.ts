import { z } from "zod";
import { IpcSchema } from "../schema";

/**
 * Tipos y utilidades relacionadas con índices económicos
 * @fileoverview Definiciones de tipos para IPC, ICL y otros indicadores económicos
 * @author Alejandro
 * @since 1.0.0
 */

/**
 * Tipo para índice de precios al consumidor basado en esquema Zod
 * @example
 * const ipc: Ipc = { fecha: "2025-06", valor: 120.5 }
 */
export type Ipc = z.infer<typeof IpcSchema>;

/**
 * Tipo para datos mensuales de IPC con inflación calculada
 * @example
 * const datosIpc: IpcMensual = [
 *   { fecha: "2025-01", inflacion: 2.5 },
 *   { fecha: "2025-02", inflacion: 3.1 }
 * ]
 */
export type IpcMensual = {
    fecha: string,
    inflacion: number
}[]

/**
 * Tipo para datos diarios del Índice de Contratos de Locación
 * @example
 * const datosIcl: IclDiario = [
 *   { fecha: "2025-01-15", indice: 1250.75 },
 *   { fecha: "2025-01-16", indice: 1251.20 }
 * ]
 */
export type IclDiario = {
    fecha: string,
    indice: number
}[]