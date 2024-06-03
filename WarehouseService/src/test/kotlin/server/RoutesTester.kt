package server

import ApiUtils
import BaseTest
import MongoInfo
import com.mongodb.client.model.Filters
import domain.Ingredient
import io.kotest.matchers.shouldBe
import io.vertx.core.Vertx
import io.vertx.kotlin.coroutines.coAwait
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.net.HttpURLConnection

class RoutesTester : BaseTest() {
    private val port = 8080
    private val apiUtils = ApiUtils(port)

    init {
        runBlocking {
            Vertx.vertx().deployVerticle(Server(MongoInfo(), port)).coAwait()
        }
    }

    @Test
    suspend fun createIngredientRouteTest() {
        val newIngredient = Json.encodeToString(coffee)
        val existingIngredient = Json.encodeToString(milk)
        apiUtils.createIngredient(newIngredient).send().coAwait().statusCode() shouldBe HttpURLConnection.HTTP_OK
        apiUtils.createIngredient(existingIngredient).send().coAwait().statusCode() shouldBe HttpURLConnection.HTTP_BAD_REQUEST
    }

    @Test
    suspend fun updateConsumedIngredientsQuantityRouteTest() {
        val decrease = 4
        val decreaseMilk = 100
        var decreaseIngredients =
            Json.encodeToString(listOf(Ingredient("milk", decrease), Ingredient("tea", decrease)))
        apiUtils.updateConsumedIngredientsQuantity(decreaseIngredients)
            .send().coAwait().statusCode() shouldBe HttpURLConnection.HTTP_OK

        decreaseIngredients = Json.encodeToString(listOf(Ingredient("tea", decrease)))
        apiUtils.updateConsumedIngredientsQuantity(decreaseIngredients)
            .send().coAwait().statusCode() shouldBe HttpURLConnection.HTTP_NOT_FOUND

        decreaseIngredients = Json.encodeToString(listOf(Ingredient("milk", decreaseMilk)))
        apiUtils.updateConsumedIngredientsQuantity(decreaseIngredients)
            .send().coAwait().statusCode() shouldBe HttpURLConnection.HTTP_BAD_REQUEST

        decreaseIngredients = Json.encodeToString(listOf(Ingredient("coffee", decrease)))
        apiUtils.updateConsumedIngredientsQuantity(decreaseIngredients)
            .send().coAwait().statusCode() shouldBe HttpURLConnection.HTTP_NOT_FOUND
    }

    @Test
    suspend fun restockRouteTest() {
        val quantity = Json.encodeToString(10)

        apiUtils.restock("tea", quantity).send().coAwait().statusCode() shouldBe HttpURLConnection.HTTP_OK

        apiUtils.restock("coffee", quantity).send().coAwait().statusCode() shouldBe HttpURLConnection.HTTP_NOT_FOUND
    }

    @Test
    suspend fun getAllIngredientsRouteTest() {
        val positiveResult = apiUtils.getAllIngredients("").send().coAwait()

        positiveResult.statusCode() shouldBe HttpURLConnection.HTTP_OK
        positiveResult.bodyAsString() shouldBe Json.encodeToString(ingredients)

        collection.deleteMany(Filters.empty())
        val negativeResult = apiUtils.getAllIngredients("").send().coAwait()
        negativeResult.statusCode() shouldBe HttpURLConnection.HTTP_NOT_FOUND
        negativeResult.bodyAsString() shouldBe "[]"
    }

    @Test
    suspend fun getAllAvailableIngredients() {
        collection.insertOne(Ingredient("coffee", 0))

        val positiveResult = apiUtils.getAllIngredients("available").send().coAwait()

        positiveResult.statusCode() shouldBe HttpURLConnection.HTTP_OK
        positiveResult.bodyAsString() shouldBe Json.encodeToString(ingredients)

        collection.deleteMany(Filters.empty())
        val negativeResult = apiUtils.getAllIngredients("available").send().coAwait()

        negativeResult.statusCode() shouldBe HttpURLConnection.HTTP_NOT_FOUND
        negativeResult.bodyAsString() shouldBe "[]"
    }
}
