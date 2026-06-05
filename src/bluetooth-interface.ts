import { ThermalTransport } from './plugin';

import type { ExecuteOptions } from './definitions';

export interface CapacitorBluetoothInterfaceOptions {
  timeout?: number;
}

/**
 * Bluetooth SPP transport for node-thermal-printer's interface slot.
 */
export class CapacitorBluetoothInterface {
  private readonly timeout: number;

  constructor(
    private readonly address: string,
    options: CapacitorBluetoothInterfaceOptions = {},
  ) {
    this.timeout = options.timeout ?? 15000;
  }

  async isPrinterConnected(): Promise<boolean> {
    return true;
  }

  async execute(buffer: Uint8Array, options: ExecuteOptions = {}): Promise<void> {
    if (options.waitForResponse) {
      throw new Error('waitForResponse is not supported on mobile');
    }

    await ThermalTransport.sendRawBluetooth({
      address: this.address,
      data: uint8ArrayToBase64(buffer),
      timeout: this.timeout,
    });
  }
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}
