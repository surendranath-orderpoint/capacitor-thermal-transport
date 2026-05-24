import { registerPlugin } from '@capacitor/core';

import type { ThermalTransportPlugin } from './definitions';

export const ThermalTransport = registerPlugin<ThermalTransportPlugin>('ThermalTransport', {
  web: () => import('./web').then((m) => new m.ThermalTransportWeb()),
});
