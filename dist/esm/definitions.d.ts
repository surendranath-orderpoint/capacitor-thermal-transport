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
}
