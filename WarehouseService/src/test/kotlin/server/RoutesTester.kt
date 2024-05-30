package server

import BaseTest
import io.kotest.matchers.shouldBe
import io.vertx.core.Vertx
import io.vertx.ext.web.client.WebClient
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class RoutesTester: BaseTest() {

    private val server = Vertx.vertx().deployVerticle(Server())
    private val client = WebClient.create(Vertx.vertx())

    @BeforeAll
    fun before(){
        server.onComplete{}
    }

    @Test
    fun createIngredientRouteTest(){
        val newIngredient = Json.encodeToString(coffee)
        val existingIngredient = Json.encodeToString(milk)

        val request = client.post(8080,"localhost", "/warehouse/")
        request.addQueryParam("ingredient", newIngredient).send().onComplete { r -> r.result().statusCode() shouldBe 200}
        request.addQueryParam("ingredient", existingIngredient).send().onComplete { r -> r.result().statusCode() shouldBe 403}

    }
}