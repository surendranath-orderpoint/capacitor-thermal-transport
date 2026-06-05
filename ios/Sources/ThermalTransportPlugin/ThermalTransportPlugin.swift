import Foundation
import Capacitor

@objc(ThermalTransportPlugin)
public class ThermalTransportPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ThermalTransportPlugin"
    public let jsName = "ThermalTransport"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestLocalNetworkAccess", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "sendRaw", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "ping", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestBluetoothAccess", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getBluetoothDevices", returnType: CAPPluginReturnPromise)
    ]

    private let implementation = ThermalTransport()

    @objc func requestLocalNetworkAccess(_ call: CAPPluginCall) {
        implementation.requestLocalNetworkAccess { error in
            if let error = error {
                call.reject(error.localizedDescription, nil, error)
                return
            }

            call.resolve()
        }
    }

    @objc func sendRaw(_ call: CAPPluginCall) {
        guard let host = call.getString("host"), !host.isEmpty else {
            call.reject("host is required")
            return
        }

        guard let dataBase64 = call.getString("data"), !dataBase64.isEmpty else {
            call.reject("data is required")
            return
        }

        guard let data = Data(base64Encoded: dataBase64) else {
            call.reject("data must be valid base64")
            return
        }

        let port = UInt16(call.getInt("port") ?? 9100)
        let timeout = call.getInt("timeout") ?? 5000

        implementation.sendRaw(host: host, port: port, data: data, timeoutMs: timeout) { error in
            if let error = error {
                call.reject(error.localizedDescription, nil, error)
                return
            }

            call.resolve()
        }
    }

    @objc func ping(_ call: CAPPluginCall) {
        guard let host = call.getString("host"), !host.isEmpty else {
            call.reject("host is required")
            return
        }

        let port = UInt16(call.getInt("port") ?? 9100)
        let timeout = call.getInt("timeout") ?? 5000

        implementation.ping(host: host, port: port, timeoutMs: timeout) { connected in
            call.resolve([
                "connected": connected
            ])
        }
    }

    @objc func requestBluetoothAccess(_ call: CAPPluginCall) {
        implementation.requestBluetoothAccess { error in
            if let error = error {
                call.reject(error.localizedDescription, nil, error)
                return
            }

            call.resolve()
        }
    }

    @objc func getBluetoothDevices(_ call: CAPPluginCall) {
        implementation.getBluetoothDevices { devices, error in
            if let error = error {
                call.reject(error.localizedDescription, nil, error)
                return
            }

            call.resolve([
                "devices": devices
            ])
        }
    }
}
