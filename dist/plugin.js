var capacitorThermalTransport = (function (exports, core) {
    'use strict';

    const ThermalTransport = core.registerPlugin('ThermalTransport', {
        web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.ThermalTransportWeb()),
    });

    /**
     * Drop-in replacement for node-thermal-printer's network interface.
     * Pass this object as `interface` when constructing ThermalPrinter.
     */
    class CapacitorNetworkInterface {
        constructor(host, port = 9100, options = {}) {
            var _a;
            this.host = host;
            this.port = port;
            this.timeout = (_a = options.timeout) !== null && _a !== void 0 ? _a : 5000;
        }
        async isPrinterConnected() {
            const { connected } = await ThermalTransport.ping({
                host: this.host,
                port: this.port,
                timeout: this.timeout,
            });
            return connected;
        }
        async execute(buffer, options = {}) {
            if (options.waitForResponse) {
                throw new Error('waitForResponse is not supported on mobile');
            }
            await ThermalTransport.sendRaw({
                host: this.host,
                port: this.port,
                data: uint8ArrayToBase64(buffer),
                timeout: this.timeout,
            });
        }
    }
    function uint8ArrayToBase64(bytes) {
        let binary = '';
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
    }

    class ThermalTransportWeb extends core.WebPlugin {
        async sendRaw(_options) {
            throw this.unavailable('Thermal printing requires the native iOS or Android app');
        }
        async ping(_options) {
            throw this.unavailable('Thermal printing requires the native iOS or Android app');
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ThermalTransportWeb: ThermalTransportWeb
    });

    exports.CapacitorNetworkInterface = CapacitorNetworkInterface;
    exports.ThermalTransport = ThermalTransport;

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
