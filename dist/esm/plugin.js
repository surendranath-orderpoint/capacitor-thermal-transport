import { registerPlugin } from '@capacitor/core';
export const ThermalTransport = registerPlugin('ThermalTransport', {
    web: () => import('./web').then((m) => new m.ThermalTransportWeb()),
});
//# sourceMappingURL=plugin.js.map