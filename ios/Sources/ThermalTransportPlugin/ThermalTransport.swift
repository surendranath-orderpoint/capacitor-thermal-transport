import Foundation
import Network

@objc public class ThermalTransport: NSObject {
    private let queue = DispatchQueue(label: "com.orderpoint.thermaltransport")

    @objc public func sendRaw(
        host: String,
        port: UInt16,
        data: Data,
        timeoutMs: Int,
        completion: @escaping (Error?) -> Void
    ) {
        connect(host: host, port: port, timeoutMs: timeoutMs) { connection, error in
            if let error = error {
                completion(error)
                return
            }

            guard let connection = connection else {
                completion(ThermalTransportError.connectionFailed)
                return
            }

            connection.send(content: data, completion: .contentProcessed { sendError in
                connection.cancel()
                completion(sendError)
            })
        }
    }

    @objc public func ping(
        host: String,
        port: UInt16,
        timeoutMs: Int,
        completion: @escaping (Bool) -> Void
    ) {
        connect(host: host, port: port, timeoutMs: timeoutMs) { connection, error in
            connection?.cancel()
            completion(error == nil && connection != nil)
        }
    }

    private func connect(
        host: String,
        port: UInt16,
        timeoutMs: Int,
        completion: @escaping (NWConnection?, Error?) -> Void
    ) {
        guard let nwPort = NWEndpoint.Port(rawValue: port) else {
            completion(nil, ThermalTransportError.invalidPort)
            return
        }

        let connection = NWConnection(
            host: NWEndpoint.Host(host),
            port: nwPort,
            using: .tcp
        )

        var finished = false
        let finish: (NWConnection?, Error?) -> Void = { conn, error in
            guard !finished else { return }
            finished = true
            completion(conn, error)
        }

        connection.stateUpdateHandler = { state in
            switch state {
            case .ready:
                finish(connection, nil)
            case .failed(let error):
                finish(nil, error)
            case .waiting(let error):
                finish(nil, error)
            default:
                break
            }
        }

        connection.start(queue: queue)

        queue.asyncAfter(deadline: .now() + .milliseconds(timeoutMs)) {
            if !finished {
                connection.cancel()
                finish(nil, ThermalTransportError.timeout)
            }
        }
    }
}

enum ThermalTransportError: LocalizedError {
    case invalidPort
    case connectionFailed
    case timeout

    var errorDescription: String? {
        switch self {
        case .invalidPort:
            return "Invalid printer port"
        case .connectionFailed:
            return "Could not connect to printer"
        case .timeout:
            return "Connection timed out"
        }
    }
}
