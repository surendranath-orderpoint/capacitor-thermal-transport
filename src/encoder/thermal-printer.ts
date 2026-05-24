import { Capacitor } from '@capacitor/core';

import { CapacitorNetworkInterface } from '../network-interface';
import { ThermalTransport } from '../plugin';

/** Minimal surface used by print services. */
export interface ThermalPrinterInstance {
  upsideDown(invert: boolean): void;
  println(text: string): void;
  print(text: string): void;
  newLine(): void;
  bold(enabled: boolean): void;
  underline(enabled: boolean): void;
  alignCenter(): void;
  alignLeft(): void;
  alignRight(): void;
  setTextSize(height: number, width: number): void;
  setTextNormal(): void;
  setTextDoubleHeight(): void;
  setTextDoubleWidth(): void;
  setTextDouble(): void;
  setTextColorToRed(): void;
  setTextColorToBlack(): void;
  getWidth(): number;
  cut(): void;
  execute(): Promise<unknown>;
}

export interface ThermalPrinterLayout {
  charset: string;
}

type ThermalPrinterConstructor = new (
  config: Record<string, unknown>
) => ThermalPrinterInstance;

let thermalPrinterClassPromise: Promise<ThermalPrinterConstructor> | null = null;

function resolveThermalPrinterClass(module: unknown): ThermalPrinterConstructor {
  const root =
    (module as { default?: Record<string, unknown> }).default ??
    (module as Record<string, unknown>);

  const ThermalPrinter = root['printer'] ?? root['ThermalPrinter'];

  if (typeof ThermalPrinter !== 'function') {
    throw new Error('Failed to load thermal printer encoder.');
  }

  return ThermalPrinter as ThermalPrinterConstructor;
}

function loadThermalPrinterClass(): Promise<ThermalPrinterConstructor> {
  if (!thermalPrinterClassPromise) {
    thermalPrinterClassPromise = import('./encoder.mjs').then(resolveThermalPrinterClass);
  }

  return thermalPrinterClassPromise;
}

export async function createEpsonThermalPrinter(
  ip: string,
  layout: ThermalPrinterLayout
): Promise<ThermalPrinterInstance> {
  if (!Capacitor.isNativePlatform()) {
    throw new Error('Thermal printing requires the native iOS or Android app.');
  }

  const host = ip.trim();
  if (!host) {
    throw new Error('Printer IP address is required.');
  }

  if (Capacitor.getPlatform() === 'ios') {
    await ThermalTransport.requestLocalNetworkAccess();
  }

  const ThermalPrinter = await loadThermalPrinterClass();

  return new ThermalPrinter({
    type: 'epson',
    interface: new CapacitorNetworkInterface(host, 9100, { timeout: 15000 }),
    characterSet: layout.charset,
  });
}
