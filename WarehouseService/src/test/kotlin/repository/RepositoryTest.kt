package repository

import BaseTest
import domain.Ingredient
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldNotContain
import io.kotest.matchers.shouldBe
import kotlinx.coroutines.flow.toList

/**
 * Test class for Repository with kotest
 */
class RepositoryTest : BaseTest() {
    private val decreaseQuantity = 1
    private val increaseQuantity = 1
    private val repository = RepositoryImpl()

    @Test
    suspend fun getAllIngredientTest() {
        val expectedCollection = collection.find<Ingredient>().toList()
        val actualCollection = repository.getAllIngredients()
        actualCollection shouldBe expectedCollection
    }

    @Test
    suspend fun createIngredientTest() {
        val response = repository.createIngredient(coffee.name, coffee.quantity)
        val expectedCollection = ingredients + coffee
        val actualCollection = collection.find<Ingredient>().toList()
        actualCollection shouldBe expectedCollection
        response shouldBe WarehouseResponse.OK
    }

    @Test
    suspend fun createIngredientAlreadyInTheCollectionTest() {
        val response = repository.createIngredient(milk.name, milk.quantity)
        val actualCollection = collection.find<Ingredient>().toList()
        actualCollection shouldBe ingredients
        response shouldBe WarehouseResponse.ERROR
    }

    @Test
    suspend fun isIngredientPresentPositiveCaseTest() {
        val actualCollection = collection.find<Ingredient>().toList()
        actualCollection shouldContain milk
        repository.isIngredientPresent(milk.name) shouldBe true
    }

    @Test
    suspend fun isIngredientPresentNegativeCaseTest() {
        val actualCollection = collection.find<Ingredient>().toList()
        actualCollection shouldNotContain coffee
        repository.isIngredientPresent(coffee.name) shouldBe false
    }

    @Test
    suspend fun getIngredientQuantityPositiveCaseTest() {
        val actualCollection = collection.find<Ingredient>().toList()
        actualCollection shouldContain milk
        repository.getIngredientQuantity(milk.name) shouldBe milk.quantity
    }

    @Test
    suspend fun getIngredientQuantityNegativeCaseTest() {
        val actualCollection = collection.find<Ingredient>().toList()
        actualCollection shouldNotContain coffee
        repository.getIngredientQuantity(coffee.name) shouldBe null
    }

    @Test
    suspend fun decreaseNotPresentIngredientQuantityTest() {
        val actualCollection = collection.find<Ingredient>().toList()
        actualCollection shouldNotContain coffee
        val response = repository.decreaseIngredientQuantity(coffee.name, decreaseQuantity)
        collection.find<Ingredient>().toList() shouldBe ingredients
        response shouldBe WarehouseResponse.ERROR
    }

    @Test
    suspend fun decreasePresentIngredientQuantityTest() {
        val actualCollection = collection.find<Ingredient>().toList()
        actualCollection shouldContain milk
        val response = repository.decreaseIngredientQuantity(milk.name, decreaseQuantity)
        val expectedCollection: List<Ingredient> =
            listOf(Ingredient(milk.name, milk.quantity - decreaseQuantity), tea)
        collection.find<Ingredient>().toList() shouldBe expectedCollection
        response shouldBe WarehouseResponse.OK
    }

    @Test
    suspend fun restockNotPresentIngredientTest() {
        val actualCollection = collection.find<Ingredient>().toList()
        actualCollection shouldNotContain coffee
        val response = repository.restock(coffee.name, increaseQuantity)
        collection.find<Ingredient>().toList() shouldBe ingredients
        response shouldBe WarehouseResponse.ERROR
    }

    @Test
    suspend fun restockPresentIngredientTest() {
        val actualCollection = collection.find<Ingredient>().toList()
        actualCollection shouldContain milk
        val response = repository.restock(milk.name, increaseQuantity)
        val expectedCollection: List<Ingredient> =
            listOf(Ingredient(milk.name, milk.quantity + increaseQuantity), tea)
        collection.find<Ingredient>().toList() shouldBe expectedCollection
        response shouldBe WarehouseResponse.OK
    }

    @Test
    suspend fun getAllAvailableIngredients() {
        collection.insertOne(notAvailableCoffee)
        val actualCollection = collection.find<Ingredient>().toList()
        actualCollection shouldBe ingredients + notAvailableCoffee
        val availableIngredients = repository.getAllAvailableIngredients()
        availableIngredients shouldBe ingredients
    }
}
