import { WebPlugin } from '@capacitor/core';
export class ThermalTransportWeb extends WebPlugin {
    async sendRaw(_options) {
        throw this.unavailable('Thermal printing requires the native iOS or Android app');
    }
    async ping(_options) {
        throw this.unavailable('Thermal printing requires the native iOS or Android app');
    }
}
//# sourceMappingURL=web.js.map