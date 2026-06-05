import Foundation
import CoreBluetooth

@objc public class BluetoothScanner: NSObject, CBCentralManagerDelegate {
    private var centralManager: CBCentralManager?
    private var devices: [String: [String: String]] = [:]
    private var scanCompletion: (([[String: String]], Error?) -> Void)?
    private var accessCompletion: ((Error?) -> Void)?
    private var scanTimer: DispatchWorkItem?
    private var pendingScanDurationMs = 4000
    private let queue = DispatchQueue(label: "com.orderpoint.thermaltransport.bluetooth")

    @objc public func requestAccess(completion: @escaping (Error?) -> Void) {
        queue.async {
            self.accessCompletion = completion
            if self.centralManager == nil {
                self.centralManager = CBCentralManager(delegate: self, queue: self.queue)
            } else {
                self.resolveAccess(for: self.centralManager?.state ?? .unknown)
            }
        }
    }

    @objc public func getDevices(
        scanDurationMs: Int = 4000,
        completion: @escaping ([[String: String]], Error?) -> Void
    ) {
        queue.async {
            self.devices.removeAll()
            self.scanCompletion = completion
            self.pendingScanDurationMs = scanDurationMs

            if self.centralManager == nil {
                self.centralManager = CBCentralManager(delegate: self, queue: self.queue)
            } else {
                self.resolveScan(for: self.centralManager?.state ?? .unknown)
            }
        }
    }

    public func centralManagerDidUpdateState(_ central: CBCentralManager) {
        resolveAccess(for: central.state)
        resolveScan(for: central.state)
    }

    public func centralManager(
        _ central: CBCentralManager,
        didDiscover peripheral: CBPeripheral,
        advertisementData: [String: Any],
        rssi RSSI: NSNumber
    ) {
        let address = peripheral.identifier.uuidString
        let advertisedName = advertisementData[CBAdvertisementDataLocalNameKey] as? String
        let name = Self.nonEmpty(peripheral.name)
            ?? Self.nonEmpty(advertisedName)
            ?? "Unknown device"

        devices[address] = [
            "name": name,
            "address": address,
        ]
    }

    private func resolveAccess(for state: CBManagerState) {
        guard accessCompletion != nil else { return }

        switch state {
        case .poweredOn:
            finishAccess(nil)
        case .unauthorized:
            finishAccess(ThermalTransportError.bluetoothUnauthorized)
        case .poweredOff, .unsupported:
            finishAccess(ThermalTransportError.bluetoothUnavailable)
        case .unknown, .resetting:
            break
        @unknown default:
            break
        }
    }

    private func resolveScan(for state: CBManagerState) {
        guard scanCompletion != nil else { return }

        switch state {
        case .poweredOn:
            startScan(durationMs: pendingScanDurationMs)
        case .unauthorized:
            finishScan(ThermalTransportError.bluetoothUnauthorized)
        case .poweredOff, .unsupported:
            finishScan(ThermalTransportError.bluetoothUnavailable)
        case .unknown, .resetting:
            break
        @unknown default:
            break
        }
    }

    private func startScan(durationMs: Int) {
        guard let central = centralManager, central.state == .poweredOn else { return }

        central.scanForPeripherals(withServices: nil, options: [
            CBCentralManagerScanOptionAllowDuplicatesKey: false,
        ])

        scanTimer?.cancel()
        let timer = DispatchWorkItem { [weak self] in
            self?.centralManager?.stopScan()
            self?.finishScan(nil)
        }
        scanTimer = timer
        queue.asyncAfter(deadline: .now() + .milliseconds(durationMs), execute: timer)
    }

    private static func nonEmpty(_ value: String?) -> String? {
        guard let trimmed = value?.trimmingCharacters(in: .whitespacesAndNewlines), !trimmed.isEmpty else {
            return nil
        }
        return trimmed
    }

    private func finishAccess(_ error: Error?) {
        let completion = accessCompletion
        accessCompletion = nil
        completion?(error)
    }

    private func finishScan(_ error: Error?) {
        scanTimer?.cancel()
        scanTimer = nil
        centralManager?.stopScan()

        let completion = scanCompletion
        scanCompletion = nil

        if let error = error {
            completion?([], error)
            return
        }

        let sortedDevices = devices.values.sorted {
            $0["name", default: ""] < $1["name", default: ""]
        }
        completion?(sortedDevices, nil)
    }
}
