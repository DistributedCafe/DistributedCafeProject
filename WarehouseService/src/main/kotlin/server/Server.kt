package server

import handlers.HandlerImpl
import io.vertx.core.Vertx
import io.vertx.ext.web.Router
import io.vertx.kotlin.core.http.httpServerOptionsOf
import io.vertx.kotlin.coroutines.CoroutineVerticle
import io.vertx.kotlin.coroutines.dispatcher
import kotlinx.coroutines.launch

class Server : CoroutineVerticle() {
    override suspend fun start() {
        val handler = HandlerImpl()
        val router = Router.router(vertx)

        router.post("/warehouse/").handler {
                ctx ->
            launch(Vertx.currentContext().dispatcher()) { handler.createIngredient(ctx) }
        }

        router.get("/warehouse/").handler {
                ctx ->
            launch(Vertx.currentContext().dispatcher()) { handler.getAllIngredients(ctx) }
        }

        router.put("/warehouse/").handler {
                ctx ->
            launch(Vertx.currentContext().dispatcher()) { handler.updateConsumedIngredientsQuantity(ctx) }
        }

        router.put("/warehouse/:ingredient").handler {
                ctx ->
            launch(Vertx.currentContext().dispatcher()) { handler.restock(ctx) }
        }

        router.get("/warehouse/available").handler {
                ctx ->
            launch(Vertx.currentContext().dispatcher()) { handler.getAllAvailableIngredients(ctx) }
        }

        vertx.createHttpServer(
            httpServerOptionsOf(
                port = 8080,
                host = "localhost",
            ),
        ).requestHandler(router).listen()
        print("Server started on 8080")
    }
}
