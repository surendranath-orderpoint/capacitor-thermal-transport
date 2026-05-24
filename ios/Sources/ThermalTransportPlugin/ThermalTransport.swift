import Foundation

@objc public class ThermalTransport: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
