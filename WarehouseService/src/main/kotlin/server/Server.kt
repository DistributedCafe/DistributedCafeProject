package server

import io.vertx.kotlin.core.http.httpServerOptionsOf
import io.vertx.kotlin.coroutines.CoroutineVerticle


class Server : CoroutineVerticle() {

    override suspend fun start() {
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