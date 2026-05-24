package com.orderpoint.thermaltransport

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "ThermalTransport")
class ThermalTransportPlugin : Plugin() {

    private val implementation = ThermalTransport()

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

        val port = call.getInt("port", DEFAULT_PORT)
        val timeout = call.getInt("timeout", DEFAULT_TIMEOUT)

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
    fun ping(call: PluginCall) {
        val host = call.getString("host")
        if (host.isNullOrBlank()) {
            call.reject("host is required")
            return
        }

        val port = call.getInt("port", DEFAULT_PORT)
        val timeout = call.getInt("timeout", DEFAULT_TIMEOUT)

        Thread {
            val connected = implementation.ping(host, port, timeout)
            val result = JSObject().apply {
                put("connected", connected)
            }
            call.resolve(result)
        }.start()
    }

    companion object {
        private const val DEFAULT_PORT = 9100
        private const val DEFAULT_TIMEOUT = 5000
    }
}
