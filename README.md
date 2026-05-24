# @orderpoint/capacitor-thermal-transport

Thin TCP transport for ESC/POS thermal printers on LAN. This plugin sends raw bytes to network printers on port 9100. Use it together with `node-thermal-printer` for command encoding.

## Install

This plugin installs [node-thermal-printer](https://github.com/surendranath-orderpoint/node-thermal-printer) automatically for ESC/POS encoding.

```bash
npm install ../plugins/capacitor-thermal-transport
npx cap sync
```

For local development, override with the checked-out fork in your app `package.json`:

```json
"node-thermal-printer": "file:../node-thermal-printer"
```

## Usage with node-thermal-printer

```typescript
import { ThermalPrinter, PrinterTypes } from 'node-thermal-printer';
import { CapacitorNetworkInterface } from '@orderpoint/capacitor-thermal-transport';

const printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: new CapacitorNetworkInterface('192.168.1.50', 9100, { timeout: 5000 }),
  characterSet: layout.charset,
});

printer.println('Hello');
printer.cut();
await printer.execute();
```

## iOS setup

Add to the merchant app `Info.plist`:

```xml
<key>NSLocalNetworkUsageDescription</key>
<string>Connect to kitchen receipt printers on your local network.</string>
```

## API

<docgen-index>

* [`sendRaw(...)`](#sendraw)
* [`ping(...)`](#ping)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### sendRaw(...)

```typescript
sendRaw(options: SendRawOptions) => Promise<void>
```

Send raw ESC/POS bytes to a network printer over TCP.

| Param         | Type                                                      |
| ------------- | --------------------------------------------------------- |
| **`options`** | <code><a href="#sendrawoptions">SendRawOptions</a></code> |

--------------------


### ping(...)

```typescript
ping(options: PingOptions) => Promise<PingResult>
```

Check whether a TCP connection can be opened to the printer.

| Param         | Type                                                |
| ------------- | --------------------------------------------------- |
| **`options`** | <code><a href="#pingoptions">PingOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#pingresult">PingResult</a>&gt;</code>

--------------------


### Interfaces


#### SendRawOptions

| Prop          | Type                | Description                                          |
| ------------- | ------------------- | ---------------------------------------------------- |
| **`host`**    | <code>string</code> | Printer IP address or hostname on the local network  |
| **`port`**    | <code>number</code> | Raw port, defaults to 9100                           |
| **`data`**    | <code>string</code> | Base64-encoded ESC/POS bytes                         |
| **`timeout`** | <code>number</code> | Connection timeout in milliseconds, defaults to 5000 |


#### PingResult

| Prop            | Type                 |
| --------------- | -------------------- |
| **`connected`** | <code>boolean</code> |


#### PingOptions

| Prop          | Type                |
| ------------- | ------------------- |
| **`host`**    | <code>string</code> |
| **`port`**    | <code>number</code> |
| **`timeout`** | <code>number</code> |

</docgen-api>
