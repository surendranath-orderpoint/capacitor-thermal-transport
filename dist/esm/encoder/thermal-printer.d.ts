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
export declare function createEpsonThermalPrinter(ip: string, layout: ThermalPrinterLayout): Promise<ThermalPrinterInstance>;
