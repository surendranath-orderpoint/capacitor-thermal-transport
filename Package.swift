// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorThermalTransport",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "CapacitorThermalTransport",
            targets: ["ThermalTransportPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "ThermalTransportPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/ThermalTransportPlugin"),
        .testTarget(
            name: "ThermalTransportPluginTests",
            dependencies: ["ThermalTransportPlugin"],
            path: "ios/Tests/ThermalTransportPluginTests")
    ]
)
