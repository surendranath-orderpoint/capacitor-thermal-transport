import { Capacitor } from '@capacitor/core';
import { CapacitorNetworkInterface } from '../network-interface';
import { ThermalTransport } from '../plugin';
let thermalPrinterClassPromise = null;
function resolveThermalPrinterClass(module) {
    var _a, _b;
    const root = (_a = module.default) !== null && _a !== void 0 ? _a : module;
    const ThermalPrinter = (_b = root['printer']) !== null && _b !== void 0 ? _b : root['ThermalPrinter'];
    if (typeof ThermalPrinter !== 'function') {
        throw new Error('Failed to load thermal printer encoder.');
    }
    return ThermalPrinter;
}
function loadThermalPrinterClass() {
    if (!thermalPrinterClassPromise) {
        thermalPrinterClassPromise = import('./encoder.mjs').then(resolveThermalPrinterClass);
    }
    return thermalPrinterClassPromise;
}
export async function createEpsonThermalPrinter(ip, layout) {
    if (!Capacitor.isNativePlatform()) {
        throw new Error('Thermal printing requires the native iOS or Android app.');
    }
    const host = ip.trim();
    if (!host) {
        throw new Error('Printer IP address is required.');
    }
    if (Capacitor.getPlatform() === 'ios') {
        await ThermalTransport.requestLocalNetworkAccess();
    }
    const ThermalPrinter = await loadThermalPrinterClass();
    return new ThermalPrinter({
        type: 'epson',
        interface: new CapacitorNetworkInterface(host, 9100, { timeout: 15000 }),
        characterSet: layout.charset,
    });
}
//# sourceMappingURL=thermal-printer.js.map