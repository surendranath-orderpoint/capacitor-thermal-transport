package com.orderpoint.thermaltransport

import android.Manifest
import android.os.Build
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.PermissionState
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback

@CapacitorPlugin(
    name = "ThermalTransport",
    permissions = [
        Permission(
            strings = [
                Manifest.permission.BLUETOOTH_CONNECT,
                Manifest.permission.BLUETOOTH_SCAN,
            ],
            alias = "bluetooth",
        ),
    ],
)
class ThermalTransportPlugin : Plugin() {

    private val implementation = ThermalTransport()

    @PluginMethod
    fun requestLocalNetworkAccess(call: PluginCall) {
        call.resolve()
    }

    @PluginMethod
    fun sendRaw(call: PluginCall) {
        val host = call.getString("host")
        if (host.isNullOrBlank()) {
            call.reject("host is required")
            return
        }

        val data = call.getString("data")
        if (data.isNullOrBlank()) {
            call.reject("data is required")
            return
        }

        val port = call.getInt("port") ?: DEFAULT_PORT
        val timeout = call.getInt("timeout") ?: DEFAULT_TIMEOUT

        Thread {
            try {
                val bytes = implementation.decodeBase64(data)
                implementation.sendRaw(host, port, bytes, timeout)
                call.resolve()
            } catch (error: Exception) {
                call.reject(error.message ?: "Failed to send data to printer", error)
            }
        }.start()
    }

    @PluginMethod
    fun sendRawBluetooth(call: PluginCall) {
        val address = call.getString("address")
        if (address.isNullOrBlank()) {
            call.reject("address is required")
            return
        }

        val data = call.getString("data")
        if (data.isNullOrBlank()) {
            call.reject("data is required")
            return
        }

        val timeout = call.getInt("timeout") ?: DEFAULT_BLUETOOTH_TIMEOUT

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
            getPermissionState(BLUETOOTH_PERMISSION) != PermissionState.GRANTED
        ) {
            requestPermissionForAlias(BLUETOOTH_PERMISSION, call, "sendRawBluetoothCallback")
            return
        }

        executeSendRawBluetooth(call, address, data, timeout)
    }

    @PermissionCallback
    private fun sendRawBluetoothCallback(call: PluginCall) {
        if (getPermissionState(BLUETOOTH_PERMISSION) != PermissionState.GRANTED) {
            call.reject("Bluetooth permission denied")
            return
        }

        val address = call.getString("address")
        val data = call.getString("data")
        if (address.isNullOrBlank() || data.isNullOrBlank()) {
            call.reject("address and data are required")
            return
        }

        val timeout = call.getInt("timeout") ?: DEFAULT_BLUETOOTH_TIMEOUT
        executeSendRawBluetooth(call, address, data, timeout)
    }

    private fun executeSendRawBluetooth(
        call: PluginCall,
        address: String,
        data: String,
        timeout: Int,
    ) {
        Thread {
            try {
                val bytes = implementation.decodeBase64(data)
                implementation.sendRawBluetooth(address, bytes, timeout)
                call.resolve()
            } catch (error: Exception) {
                call.reject(error.message ?: "Failed to send data to Bluetooth printer", error)
            }
        }.start()
    }

    @PluginMethod
    fun ping(call: PluginCall) {
        val host = call.getString("host")
        if (host.isNullOrBlank()) {
            call.reject("host is required")
            return
        }

        val port = call.getInt("port") ?: DEFAULT_PORT
        val timeout = call.getInt("timeout") ?: DEFAULT_TIMEOUT

        Thread {
            val connected = implementation.ping(host, port, timeout)
            val result = JSObject().apply {
                put("connected", connected)
            }
            call.resolve(result)
        }.start()
    }

    @PluginMethod
    fun requestBluetoothAccess(call: PluginCall) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            call.resolve()
            return
        }

        if (getPermissionState(BLUETOOTH_PERMISSION) == PermissionState.GRANTED) {
            call.resolve()
            return
        }

        requestPermissionForAlias(BLUETOOTH_PERMISSION, call, "bluetoothAccessCallback")
    }

    @PermissionCallback
    private fun bluetoothAccessCallback(call: PluginCall) {
        if (getPermissionState(BLUETOOTH_PERMISSION) == PermissionState.GRANTED) {
            call.resolve()
        } else {
            call.reject("Bluetooth permission denied")
        }
    }

    @PluginMethod
    fun getBluetoothDevices(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
            getPermissionState(BLUETOOTH_PERMISSION) != PermissionState.GRANTED
        ) {
            requestPermissionForAlias(BLUETOOTH_PERMISSION, call, "getBluetoothDevicesCallback")
            return
        }

        resolveBluetoothDevices(call)
    }

    @PermissionCallback
    private fun getBluetoothDevicesCallback(call: PluginCall) {
        if (getPermissionState(BLUETOOTH_PERMISSION) == PermissionState.GRANTED) {
            resolveBluetoothDevices(call)
        } else {
            call.reject("Bluetooth permission denied")
        }
    }

    private fun resolveBluetoothDevices(call: PluginCall) {
        val devices = implementation.getPairedBluetoothDevices(context)
        val deviceArray = JSArray()
        for (device in devices) {
            deviceArray.put(
                JSObject().apply {
                    put("name", device.name)
                    put("address", device.address)
                },
            )
        }

        val result = JSObject().apply {
            put("devices", deviceArray)
        }
        call.resolve(result)
    }

    companion object {
        private const val BLUETOOTH_PERMISSION = "bluetooth"
        private const val DEFAULT_PORT = 9100
        private const val DEFAULT_TIMEOUT = 5000
        private const val DEFAULT_BLUETOOTH_TIMEOUT = 15000
    }
}
