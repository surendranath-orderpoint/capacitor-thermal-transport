import XCTest
@testable import ThermalTransportPlugin

class ThermalTransportTests: XCTestCase {
    func testPingToInvalidHostReturnsFalse() {
        let implementation = ThermalTransport()
        let expectation = expectation(description: "ping completes")

        implementation.ping(host: "203.0.113.1", port: 9100, timeoutMs: 500) { connected in
            XCTAssertFalse(connected)
            expectation.fulfill()
        }

        waitForExpectations(timeout: 5)
    }
}
