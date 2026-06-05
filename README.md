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

* [`requestLocalNetworkAccess()`](#requestlocalnetworkaccess)
* [`sendRaw(...)`](#sendraw)
* [`sendRawBluetooth(...)`](#sendrawbluetooth)
* [`ping(...)`](#ping)
* [`requestBluetoothAccess()`](#requestbluetoothaccess)
* [`getBluetoothDevices()`](#getbluetoothdevices)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### requestLocalNetworkAccess()

```typescript
requestLocalNetworkAccess() => Promise<void>
```

iOS only: trigger the local network permission prompt before printing.

--------------------


### sendRaw(...)

```typescript
sendRaw(options: SendRawOptions) => Promise<void>
```

Send raw ESC/POS bytes to a network printer over TCP.

| Param         | Type                                                      |
| ------------- | --------------------------------------------------------- |
| **`options`** | <code><a href="#sendrawoptions">SendRawOptions</a></code> |

--------------------


### sendRawBluetooth(...)

```typescript
sendRawBluetooth(options: SendRawBluetoothOptions) => Promise<void>
```

Send raw ESC/POS bytes to a paired Bluetooth thermal printer over SPP.

| Param         | Type                                                                        |
| ------------- | --------------------------------------------------------------------------- |
| **`options`** | <code><a href="#sendrawbluetoothoptions">SendRawBluetoothOptions</a></code> |

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


### requestBluetoothAccess()

```typescript
requestBluetoothAccess() => Promise<void>
```

Request Bluetooth access. On Android this requests runtime permission; on iOS it
triggers the Bluetooth permission prompt.

--------------------


### getBluetoothDevices()

```typescript
getBluetoothDevices() => Promise<GetBluetoothDevicesResult>
```

List Bluetooth printers available for printing on the native app.

**Returns:** <code>Promise&lt;<a href="#getbluetoothdevicesresult">GetBluetoothDevicesResult</a>&gt;</code>

--------------------


### Interfaces


#### SendRawOptions

| Prop          | Type                | Description                                          |
| ------------- | ------------------- | ---------------------------------------------------- |
| **`host`**    | <code>string</code> | Printer IP address or hostname on the local network  |
| **`port`**    | <code>number</code> | Raw port, defaults to 9100                           |
| **`data`**    | <code>string</code> | Base64-encoded ESC/POS bytes                         |
| **`timeout`** | <code>number</code> | Connection timeout in milliseconds, defaults to 5000 |


#### SendRawBluetoothOptions

| Prop          | Type                | Description                                           |
| ------------- | ------------------- | ----------------------------------------------------- |
| **`address`** | <code>string</code> | Bluetooth MAC address on Android                      |
| **`data`**    | <code>string</code> | Base64-encoded ESC/POS bytes                          |
| **`timeout`** | <code>number</code> | Connection timeout in milliseconds, defaults to 15000 |


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


#### GetBluetoothDevicesResult

| Prop          | Type                           |
| ------------- | ------------------------------ |
| **`devices`** | <code>BluetoothDevice[]</code> |


#### BluetoothDevice

| Prop          | Type                | Description                                              |
| ------------- | ------------------- | -------------------------------------------------------- |
| **`address`** | <code>string</code> | Bluetooth MAC address on Android, peripheral UUID on iOS |
| **`name`**    | <code>string</code> | Human-readable device name from the OS                   |

</docgen-api>
