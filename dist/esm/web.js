import { WebPlugin } from '@capacitor/core';
export class ThermalTransportWeb extends WebPlugin {
    async requestLocalNetworkAccess() {
        return;
    }
    async sendRaw(_options) {
        throw this.unavailable('Thermal printing requires the native iOS or Android app');
    }
    async ping(_options) {
        throw this.unavailable('Thermal printing requires the native iOS or Android app');
    }
    async requestBluetoothAccess() {
        return;
    }
    async getBluetoothDevices() {
        return { devices: [] };
    }
}
//# sourceMappingURL=web.js.map