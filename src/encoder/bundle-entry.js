import { Buffer } from 'buffer';
import process from 'process/browser';
import nodeThermalPrinter from 'node-thermal-printer';

globalThis.Buffer = globalThis.Buffer || Buffer;
globalThis.process = globalThis.process || process;

export default nodeThermalPrinter;
export const printer = nodeThermalPrinter;
export const ThermalPrinter = nodeThermalPrinter;
