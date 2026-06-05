export interface SendRawOptions {
  /** Printer IP address or hostname on the local network */
  host: string;
  /** Raw port, defaults to 9100 */
  port?: number;
  /** Base64-encoded ESC/POS bytes */
  data: string;
  /** Connection timeout in milliseconds, defaults to 5000 */
  timeout?: number;
}

export interface PingOptions {
  host: string;
  port?: number;
  timeout?: number;
}

export interface PingResult {
  connected: boolean;
}

export interface ExecuteOptions {
  waitForResponse?: boolean;
}

export interface BluetoothDevice {
  /** Bluetooth MAC address on Android, peripheral UUID on iOS */
  address: string;
  /** Human-readable device name from the OS */
  name: string;
}

export interface GetBluetoothDevicesResult {
  devices: BluetoothDevice[];
}

export interface ThermalTransportPlugin {
  /**
   * iOS only: trigger the local network permission prompt before printing.
   */
  requestLocalNetworkAccess(): Promise<void>;

  /**
   * Send raw ESC/POS bytes to a network printer over TCP.
   */
  sendRaw(options: SendRawOptions): Promise<void>;

  /**
   * Check whether a TCP connection can be opened to the printer.
   */
  ping(options: PingOptions): Promise<PingResult>;

  /**
   * Request Bluetooth access. On Android this requests runtime permission; on iOS it
   * triggers the Bluetooth permission prompt.
   */
  requestBluetoothAccess(): Promise<void>;

  /**
   * List Bluetooth printers available for printing on the native app.
   */
  getBluetoothDevices(): Promise<GetBluetoothDevicesResult>;
}
