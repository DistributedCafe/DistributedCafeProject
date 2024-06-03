package server

import ApiUtils
import BaseTest
import domain.Ingredient
import io.kotest.matchers.shouldBe
import io.vertx.core.Vertx
import io.vertx.kotlin.coroutines.coAwait
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class RoutesTesterWrongConnection : BaseTest() {
    private val port = 8081
    private val apiUtils = ApiUtils(port)

    init {
        runBlocking {
            Vertx.vertx().deployVerticle(Server(getWrongInfo(), port)).coAwait()
        }
    }

    @Test
    suspend fun createIngredientRouteTest() {
        val newIngredient = Json.encodeToString(coffee)

        apiUtils.createIngredient(newIngredient).send().coAwait().statusCode() shouldBe 500
    }

    @Ignore
    @Test
    suspend fun updateConsumedIngredientsQuantityRouteTest() {
        val decreaseMilk = 10
        val decreaseTea = 4

        val decreaseIngredients =
            Json.encodeToString(listOf(Ingredient("milk", decreaseMilk), Ingredient("tea", decreaseTea)))

        apiUtils.updateConsumedIngredientsQuantity(decreaseIngredients).send().coAwait().statusCode() shouldBe 500
    }

    @Ignore
    @Test
    suspend fun restockRouteTest() {
        val quantity = Json.encodeToString(10)

        apiUtils.restock("tea", quantity).send().coAwait().statusCode() shouldBe 500
    }

    @Ignore
    @Test
    suspend fun getAllIngredientsRouteTest() {
        val positiveResult = apiUtils.getAllIngredients("").send().coAwait()

        positiveResult.statusCode() shouldBe 500
        positiveResult.bodyAsString() shouldBe null
    }

    @Ignore
    @Test
    suspend fun getAllAvailableIngredients() {
        collection.insertOne(Ingredient("coffee", 0))

        val positiveResult = apiUtils.getAllIngredients("available").send().coAwait()

        positiveResult.statusCode() shouldBe 500
        positiveResult.bodyAsString() shouldBe null
    }
}
