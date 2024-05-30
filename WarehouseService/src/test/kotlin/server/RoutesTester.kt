package server

import BaseTest
import com.mongodb.client.model.Filters
import io.kotest.matchers.shouldBe
import io.vertx.core.Vertx
import io.vertx.core.buffer.Buffer
import io.vertx.ext.web.client.HttpRequest
import io.vertx.ext.web.client.WebClient
import io.vertx.kotlin.coroutines.coAwait
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
    suspend fun createIngredientRouteTest(){
        val newIngredient = Json.encodeToString(coffee)
        val existingIngredient = Json.encodeToString(milk)
        val request = initializePost("/warehouse/")
        request.addQueryParam("ingredient", newIngredient).send().coAwait().statusCode() shouldBe 200
        request.addQueryParam("ingredient", existingIngredient).send().coAwait().statusCode() shouldBe 403

    }

    @Test
    suspend fun getAllIngredientsRouteTest(){

        val request = initializeGet("/warehouse/")

        request.send().coAwait().statusCode() shouldBe 200
        request.send().coAwait().bodyAsString() shouldBe Json.encodeToString(ingredients)

        collection.deleteMany(Filters.empty())
        val result = request.send().coAwait()
        result.statusCode() shouldBe 403
        result.bodyAsString() shouldBe "[]"
        }

    private fun initializePost(URI: String): HttpRequest<Buffer> {
        return client.post(URI).port(8080).host("localhost")
    }

    private fun initializeGet(URI: String): HttpRequest<Buffer> {
        return client.get(URI).port(8080).host("localhost")
    }
}