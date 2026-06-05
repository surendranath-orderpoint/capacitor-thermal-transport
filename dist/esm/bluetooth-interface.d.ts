import type { ExecuteOptions } from './definitions';
export interface CapacitorBluetoothInterfaceOptions {
    timeout?: number;
}
/**
 * Bluetooth SPP transport for node-thermal-printer's interface slot.
 */
export declare class CapacitorBluetoothInterface {
    private readonly address;
    private readonly timeout;
    constructor(address: string, options?: CapacitorBluetoothInterfaceOptions);
    isPrinterConnected(): Promise<boolean>;
    execute(buffer: Uint8Array, options?: ExecuteOptions): Promise<void>;
}
