package server

import BaseTest
import com.mongodb.client.model.Filters
import domain.Ingredient
import io.kotest.matchers.shouldBe
import io.vertx.core.Vertx
import io.vertx.core.buffer.Buffer
import io.vertx.ext.web.client.HttpRequest
import io.vertx.ext.web.client.WebClient
import io.vertx.kotlin.coroutines.coAwait
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class RoutesTester : BaseTest() {
    private val server = Vertx.vertx().deployVerticle(Server())
    private val client = WebClient.create(Vertx.vertx())

    @BeforeAll
    fun before() {
        server.onComplete {}
    }

    @Test
    suspend fun createIngredientRouteTest() {
        val newIngredient = Json.encodeToString(coffee)
        val existingIngredient = Json.encodeToString(milk)
        val request = initializePost("/warehouse/")
        request.addQueryParam("ingredient", newIngredient).send().coAwait().statusCode() shouldBe 200
        request.addQueryParam("ingredient", existingIngredient).send().coAwait().statusCode() shouldBe 403
    }

    @Test
    suspend fun updateConsumedIngredientsQuantityRouteTest() {
        val decreaseMilk = 10
        val decreaseTea = 4

        var decreaseIngredients = Json.encodeToString(listOf(Ingredient("milk", decreaseMilk), Ingredient("tea", decreaseTea)))

        val request = initializePut("/warehouse/")

        request.addQueryParam("ingredients", decreaseIngredients).send().coAwait().statusCode() shouldBe 200

        decreaseIngredients = Json.encodeToString(listOf(Ingredient("tea", decreaseTea)))

        request.addQueryParam("ingredients", decreaseIngredients).send().coAwait().statusCode() shouldBe 403
    }

    @Test
    suspend fun restockRouteTest() {
        val teaQuantity = 10
        val quantity = Json.encodeToString(teaQuantity)

        var request = initializePut("/warehouse/tea")
        request.addQueryParam("quantity", quantity).send().coAwait().statusCode() shouldBe 200

        request = initializePut("/warehouse/coffee")
        request.addQueryParam("quantity", quantity).send().coAwait().statusCode() shouldBe 403
    }

    @Test
    suspend fun getAllIngredientsRouteTest() {
        val request = initializeGet("/warehouse/")
        val positiveResult = request.send().coAwait()

        positiveResult.statusCode() shouldBe 200
        positiveResult.bodyAsString() shouldBe Json.encodeToString(ingredients)

        collection.deleteMany(Filters.empty())
        val negativeResult = request.send().coAwait()
        negativeResult.statusCode() shouldBe 403
        negativeResult.bodyAsString() shouldBe "[]"
    }

    @Test
    suspend fun getAllAvailableIngredients() {
        collection.insertOne(Ingredient("coffee", 0))

        val request = initializeGet("/warehouse/available")
        val positiveResult = request.send().coAwait()

        positiveResult.statusCode() shouldBe 200
        positiveResult.bodyAsString() shouldBe Json.encodeToString(ingredients)

        collection.deleteMany(Filters.empty())
        val negativeResult = request.send().coAwait()

        negativeResult.statusCode() shouldBe 403
        negativeResult.bodyAsString() shouldBe "[]"
    }

    private fun initializePost(URI: String): HttpRequest<Buffer> {
        return client.post(URI).port(8080).host("localhost")
    }

    private fun initializeGet(URI: String): HttpRequest<Buffer> {
        return client.get(URI).port(8080).host("localhost")
    }

    private fun initializePut(URI: String): HttpRequest<Buffer> {
        return client.put(URI).port(8080).host("localhost")
    }
}
