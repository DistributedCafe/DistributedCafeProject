package application

import BaseTest
import com.mongodb.client.model.Filters
import domain.Ingredient
import io.kotest.matchers.shouldBe

class WarehouseServiceTest : BaseTest() {
    private val warehouseService = WarehouseServiceImpl()

    @Test
    suspend fun getAllIngredientsTest() {
        warehouseService.getAllIngredients() shouldBe IngredientsResponse(WarehouseServiceResponse.OK, ingredients)
    }

    @Test
    suspend fun getAllIngredientsEmpty() {
        collection.deleteMany(Filters.empty())
        warehouseService.getAllIngredients() shouldBe IngredientsResponse(WarehouseServiceResponse.ERROR, emptyList())
    }

    @Test
    suspend fun createNewIngredientTest() {
        warehouseService.createIngredient(coffee) shouldBe WarehouseServiceResponse.OK
    }

    @Test
    suspend fun createExistingIngredientTest() {
        warehouseService.createIngredient(milk) shouldBe WarehouseServiceResponse.ERROR
    }

    @Test
    suspend fun successfulUpdateConsumedIngredientsQuantityTest() {
        val decreaseMilk = 10
        val decreaseTea = 4
        val decreaseIngredients = listOf(Ingredient(milk.name, decreaseMilk), Ingredient(tea.name, decreaseTea))
        warehouseService.updateConsumedIngredientsQuantity(decreaseIngredients) shouldBe WarehouseServiceResponse.OK

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
        warehouseService.updateConsumedIngredientsQuantity(decreaseIngredients) shouldBe WarehouseServiceResponse.ERROR

        val updatedIngredients = warehouseService.getAllIngredients().ingredients
        updatedIngredients shouldBe ingredients
    }

    @Test
    suspend fun restockTest() {
        warehouseService.restock(tea) shouldBe WarehouseServiceResponse.OK
        warehouseService.restock(coffee) shouldBe WarehouseServiceResponse.ERROR
    }

    @Test
    suspend fun getAllAvailableIngredientsTest() {
        collection.insertOne(notAvailableCoffee)
        warehouseService.getAllAvailableIngredients() shouldBe IngredientsResponse(WarehouseServiceResponse.OK, ingredients)
    }

    @Test
    suspend fun getAllAvailableIngredientsEmpty() {
        collection.deleteMany(Filters.empty())
        warehouseService.getAllAvailableIngredients() shouldBe IngredientsResponse(WarehouseServiceResponse.ERROR, emptyList())
    }
}
