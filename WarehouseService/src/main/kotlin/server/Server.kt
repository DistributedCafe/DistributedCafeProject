package server

import io.vertx.core.*
import io.vertx.kotlin.core.http.httpServerOptionsOf


class Server : AbstractVerticle() {

    override fun start() {
        vertx.createHttpServer(
            httpServerOptionsOf(
                port = 8080,
                host = "localhost"
            )
        )
            .requestHandler { req ->
                req.response().end("Warehouse service")
            }
            .listen()
        print("Server started on 8080")
    }
}