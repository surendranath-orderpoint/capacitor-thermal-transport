package com.orderpoint.thermaltransport

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.content.Context
import android.util.Base64
import java.net.InetSocketAddress
import java.net.Socket

class ThermalTransport {

    data class BluetoothDeviceInfo(
        val name: String,
        val address: String,
    )

    fun getPairedBluetoothDevices(context: Context): List<BluetoothDeviceInfo> {
        val manager = context.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
        val adapter = manager?.adapter ?: BluetoothAdapter.getDefaultAdapter() ?: return emptyList()

        if (!adapter.isEnabled) {
            return emptyList()
        }

        return adapter.bondedDevices
            .sortedBy { it.name?.lowercase() ?: it.address }
            .map { device ->
                BluetoothDeviceInfo(
                    name = device.name?.takeIf { it.isNotBlank() } ?: "Unknown device",
                    address = device.address,
                )
            }
    }

    @Throws(Exception::class)
    fun sendRaw(host: String, port: Int, data: ByteArray, timeoutMs: Int) {
        Socket().use { socket ->
            socket.connect(InetSocketAddress(host, port), timeoutMs)
            socket.soTimeout = timeoutMs
            socket.getOutputStream().use { output ->
                output.write(data)
                output.flush()
            }
        }
    }

    fun ping(host: String, port: Int, timeoutMs: Int): Boolean {
        return try {
            Socket().use { socket ->
                socket.connect(InetSocketAddress(host, port), timeoutMs)
            }
            true
        } catch (_: Exception) {
            false
        }
    }

    fun decodeBase64(data: String): ByteArray {
        return Base64.decode(data, Base64.DEFAULT)
    }
}
