import { ThermalTransport } from '@orderpoint/capacitor-thermal-transport';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    ThermalTransport.echo({ value: inputValue })
}
