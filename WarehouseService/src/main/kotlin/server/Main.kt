package server

import io.vertx.core.Vertx

/**
 * Entry point of the service
 */
object Main {
    @JvmStatic
    fun main(args: Array<String>) {
        val vertx = Vertx.vertx()
        vertx.deployVerticle(Server())
    }
}
