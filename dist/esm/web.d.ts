import { WebPlugin } from '@capacitor/core';
import type { PingOptions, PingResult, SendRawOptions, ThermalTransportPlugin } from './definitions';
export declare class ThermalTransportWeb extends WebPlugin implements ThermalTransportPlugin {
    sendRaw(_options: SendRawOptions): Promise<void>;
    ping(_options: PingOptions): Promise<PingResult>;
}
