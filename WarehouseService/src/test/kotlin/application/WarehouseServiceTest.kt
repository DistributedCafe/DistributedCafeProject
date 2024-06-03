package application

import BaseTest
import MongoInfo
import com.mongodb.client.model.Filters
import domain.Ingredient
import io.kotest.matchers.shouldBe

class WarehouseServiceTest : BaseTest() {
    private val warehouseService = WarehouseServiceImpl(MongoInfo())

    @Test
    suspend fun getAllIngredientsTest() {
        warehouseService.getAllIngredients() shouldBe WarehouseServiceResponse(WarehouseMessage.OK, ingredients)
    }

    @Test
    suspend fun getAllIngredientsEmpty() {
        collection.deleteMany(Filters.empty())
        warehouseService.getAllIngredients() shouldBe WarehouseServiceResponse(WarehouseMessage.ERROR_EMPTY_WAREHOUSE, emptyList())
    }

    @Test
    suspend fun createNewIngredientTest() {
        warehouseService.createIngredient(coffee) shouldBe WarehouseMessage.OK
    }

    @Test
    suspend fun createExistingIngredientTest() {
        warehouseService.createIngredient(milk) shouldBe WarehouseMessage.ERROR_INGREDIENT_ALREADY_EXISTS
    }

    @Test
    suspend fun successfulUpdateConsumedIngredientsQuantityTest() {
        val decreaseMilk = 10
        val decreaseTea = 4
        val decreaseIngredients = listOf(Ingredient(milk.name, decreaseMilk), Ingredient(tea.name, decreaseTea))
        warehouseService.updateConsumedIngredientsQuantity(decreaseIngredients) shouldBe WarehouseMessage.OK

        val updatedIngredients = warehouseService.getAllIngredients().ingredients
        val expectedIngredients =
            listOf(Ingredient(milk.name, milk.quantity - decreaseMilk), Ingredient(tea.name, tea.quantity - decreaseTea))
        updatedIngredients shouldBe expectedIngredients
    }

    @Test
    suspend fun failedUpdateConsumedIngredientsQuantityTest() {
        val decreaseMilk = 200
        val decreaseTea = 3
        val decreaseIngredients = listOf(Ingredient(milk.name, decreaseMilk), Ingredient(tea.name, decreaseTea))
        warehouseService
            .updateConsumedIngredientsQuantity(decreaseIngredients)shouldBe WarehouseMessage.ERROR_INGREDIENT_QUANTITY

        val updatedIngredients = warehouseService.getAllIngredients().ingredients
        updatedIngredients shouldBe ingredients
    }

    @Test
    suspend fun restockTest() {
        warehouseService.restock(tea) shouldBe WarehouseMessage.OK
        warehouseService.restock(coffee) shouldBe WarehouseMessage.ERROR_INGREDIENT_NOT_FOUND
    }

    @Test
    suspend fun getAllAvailableIngredientsTest() {
        collection.insertOne(notAvailableCoffee)
        warehouseService
            .getAllAvailableIngredients() shouldBe WarehouseServiceResponse(WarehouseMessage.OK, ingredients)
    }

    @Test
    suspend fun getAllAvailableIngredientsEmpty() {
        collection.deleteMany(Filters.empty())
        warehouseService
            .getAllAvailableIngredients() shouldBe WarehouseServiceResponse(WarehouseMessage.ERROR_EMPTY_WAREHOUSE, emptyList())
    }
}
