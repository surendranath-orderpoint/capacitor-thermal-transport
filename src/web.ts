import { WebPlugin } from '@capacitor/core';

import type {
  GetBluetoothDevicesResult,
  PingOptions,
  PingResult,
  SendRawBluetoothOptions,
  SendRawOptions,
  ThermalTransportPlugin,
} from './definitions';

export class ThermalTransportWeb extends WebPlugin implements ThermalTransportPlugin {
  async requestLocalNetworkAccess(): Promise<void> {
    return;
  }

  async sendRaw(_options: SendRawOptions): Promise<void> {
    throw this.unavailable('Thermal printing requires the native iOS or Android app');
  }

  async sendRawBluetooth(_options: SendRawBluetoothOptions): Promise<void> {
    throw this.unavailable('Bluetooth thermal printing requires the native iOS or Android app');
  }

  async ping(_options: PingOptions): Promise<PingResult> {
    throw this.unavailable('Thermal printing requires the native iOS or Android app');
  }

  async requestBluetoothAccess(): Promise<void> {
    return;
  }

  async getBluetoothDevices(): Promise<GetBluetoothDevicesResult> {
    return { devices: [] };
  }
}
