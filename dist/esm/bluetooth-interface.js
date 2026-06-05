import { ThermalTransport } from './plugin';
/**
 * Bluetooth SPP transport for node-thermal-printer's interface slot.
 */
export class CapacitorBluetoothInterface {
    constructor(address, options = {}) {
        var _a;
        this.address = address;
        this.timeout = (_a = options.timeout) !== null && _a !== void 0 ? _a : 15000;
    }
    async isPrinterConnected() {
        return true;
    }
    async execute(buffer, options = {}) {
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
function uint8ArrayToBase64(bytes) {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}
//# sourceMappingURL=bluetooth-interface.js.map