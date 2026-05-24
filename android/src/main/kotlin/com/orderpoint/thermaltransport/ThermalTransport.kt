package com.orderpoint.thermaltransport

import android.util.Base64
import java.net.InetSocketAddress
import java.net.Socket

class ThermalTransport {

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
