package com.orderpoint.thermaltransport

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothSocket
import android.content.Context
import android.util.Base64
import java.io.IOException
import java.net.InetSocketAddress
import java.net.Socket
import java.util.UUID
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicReference

class ThermalTransport {

    companion object {
        private val SPP_UUID: UUID =
            UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")
    }

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
    fun sendRawBluetooth(address: String, data: ByteArray, timeoutMs: Int) {
        val adapter = BluetoothAdapter.getDefaultAdapter()
            ?: throw Exception("Bluetooth is not available")

        if (!adapter.isEnabled) {
            throw Exception("Bluetooth is turned off")
        }

        try {
            adapter.cancelDiscovery()
        } catch (_: SecurityException) {
            // Paired-device printing can proceed without scan permission.
        }

        val device = adapter.getRemoteDevice(address)
        val socket = openBluetoothSocket(device, timeoutMs)

        try {
            socket.outputStream.use { output ->
                output.write(data)
                output.flush()
            }
        } finally {
            try {
                socket.close()
            } catch (_: IOException) {
            }
        }
    }

    private fun openBluetoothSocket(device: BluetoothDevice, timeoutMs: Int): BluetoothSocket {
        var lastError: Exception? = null

        try {
            return connectSocket(device.createRfcommSocketToServiceRecord(SPP_UUID), timeoutMs)
        } catch (error: Exception) {
            lastError = error
        }

        try {
            val method = device.javaClass.getMethod(
                "createRfcommSocket",
                Int::class.javaPrimitiveType,
            )
            val socket = method.invoke(device, 1) as BluetoothSocket
            return connectSocket(socket, timeoutMs)
        } catch (error: Exception) {
            lastError = error
        }

        throw lastError ?: Exception("Could not connect to Bluetooth printer")
    }

    private fun connectSocket(socket: BluetoothSocket, timeoutMs: Int): BluetoothSocket {
        val error = AtomicReference<Exception?>(null)
        val latch = CountDownLatch(1)

        Thread {
            try {
                socket.connect()
            } catch (connectError: Exception) {
                error.set(connectError)
                try {
                    socket.close()
                } catch (_: IOException) {
                }
            } finally {
                latch.countDown()
            }
        }.start()

        if (!latch.await(timeoutMs.toLong(), TimeUnit.MILLISECONDS)) {
            try {
                socket.close()
            } catch (_: IOException) {
            }
            throw Exception("Bluetooth connection timed out")
        }

        error.get()?.let { throw it }
        return socket
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
