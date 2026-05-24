import { WebPlugin } from '@capacitor/core';

import type { ThermalTransportPlugin } from './definitions';

export class ThermalTransportWeb extends WebPlugin implements ThermalTransportPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
