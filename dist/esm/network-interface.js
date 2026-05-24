import { ThermalTransport } from './plugin';
/**
 * Drop-in replacement for node-thermal-printer's network interface.
 * Pass this object as `interface` when constructing ThermalPrinter.
 */
export class CapacitorNetworkInterface {
    constructor(host, port = 9100, options = {}) {
        var _a;
        this.host = host;
        this.port = port;
        this.timeout = (_a = options.timeout) !== null && _a !== void 0 ? _a : 5000;
    }
    async isPrinterConnected() {
        const { connected } = await ThermalTransport.ping({
            host: this.host,
            port: this.port,
            timeout: this.timeout,
        });
        return connected;
    }
    async execute(buffer, options = {}) {
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
function uint8ArrayToBase64(bytes) {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}
//# sourceMappingURL=network-interface.js.map