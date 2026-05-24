export interface ThermalTransportPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
