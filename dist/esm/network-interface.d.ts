import type { ExecuteOptions } from './definitions';
export interface CapacitorNetworkInterfaceOptions {
    timeout?: number;
}
/**
 * Drop-in replacement for node-thermal-printer's network interface.
 * Pass this object as `interface` when constructing ThermalPrinter.
 */
export declare class CapacitorNetworkInterface {
    private readonly host;
    private readonly port;
    private readonly timeout;
    constructor(host: string, port?: number, options?: CapacitorNetworkInterfaceOptions);
    isPrinterConnected(): Promise<boolean>;
    execute(buffer: Uint8Array, options?: ExecuteOptions): Promise<void>;
}
