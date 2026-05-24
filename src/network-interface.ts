import { ThermalTransport } from './plugin';

import type { ExecuteOptions } from './definitions';

export interface CapacitorNetworkInterfaceOptions {
  timeout?: number;
}

/**
 * Drop-in replacement for node-thermal-printer's network interface.
 * Pass this object as `interface` when constructing ThermalPrinter.
 */
export class CapacitorNetworkInterface {
  private readonly timeout: number;

  constructor(
    private readonly host: string,
    private readonly port = 9100,
    options: CapacitorNetworkInterfaceOptions = {},
  ) {
    this.timeout = options.timeout ?? 5000;
  }

  async isPrinterConnected(): Promise<boolean> {
    const { connected } = await ThermalTransport.ping({
      host: this.host,
      port: this.port,
      timeout: this.timeout,
    });
    return connected;
  }

  async execute(buffer: Uint8Array, options: ExecuteOptions = {}): Promise<void> {
    if (options.waitForResponse) {
      throw new Error('waitForResponse is not supported on mobile');
    }

    await ThermalTransport.sendRaw({
      host: this.host,
      port: this.port,
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
