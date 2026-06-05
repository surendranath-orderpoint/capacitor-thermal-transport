import { WebPlugin } from '@capacitor/core';
import type { GetBluetoothDevicesResult, PingOptions, PingResult, SendRawBluetoothOptions, SendRawOptions, ThermalTransportPlugin } from './definitions';
export declare class ThermalTransportWeb extends WebPlugin implements ThermalTransportPlugin {
    requestLocalNetworkAccess(): Promise<void>;
    sendRaw(_options: SendRawOptions): Promise<void>;
    sendRawBluetooth(_options: SendRawBluetoothOptions): Promise<void>;
    ping(_options: PingOptions): Promise<PingResult>;
    requestBluetoothAccess(): Promise<void>;
    getBluetoothDevices(): Promise<GetBluetoothDevicesResult>;
}
