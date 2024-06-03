package application

import MongoInfo
import WarehouseMessage
import domain.Ingredient
import repository.RepositoryImpl

class WarehouseServiceImpl(mongoInfo: MongoInfo) : WarehouseService {
    private val repository = RepositoryImpl(mongoInfo)

    override suspend fun getAllIngredients(): WarehouseServiceResponse {
        val ingredients = repository.getAllIngredients()
        return correctIngredientList(ingredients.data)
    }

    override suspend fun createIngredient(ingredient: Ingredient): WarehouseMessage {
        return repository.createIngredient(ingredient.name, ingredient.quantity)
    }

    override suspend fun updateConsumedIngredientsQuantity(ingredients: List<UpdateQuantity>): WarehouseMessage {
        val availableIngredients = repository.getAllAvailableIngredients().data
        ingredients.forEach {
            if (availableIngredients.none { i -> i.name == it.name }) {
                return WarehouseMessage.ERROR_INGREDIENT_NOT_FOUND
            } else if (availableIngredients.find { i -> i.name == it.name }?.quantity!! < it.quantity) {
                return WarehouseMessage.ERROR_INGREDIENT_QUANTITY
            }
        }

        ingredients.forEach {
                i ->
            repository.decreaseIngredientQuantity(i.name, i.quantity)
        }
        return WarehouseMessage.OK
    }

    override suspend fun restock(ingredient: UpdateQuantity): WarehouseMessage {
        return repository.restock(ingredient.name, ingredient.quantity)
    }

    override suspend fun getAllAvailableIngredients(): WarehouseServiceResponse {
        val ingredients = repository.getAllAvailableIngredients()
        return correctIngredientList(ingredients.data)
    }

    private fun correctIngredientList(ingredients: List<Ingredient>): WarehouseServiceResponse {
        return WarehouseServiceResponse(
            if (ingredients.isNotEmpty()) {
                WarehouseMessage.OK
            } else {
                WarehouseMessage.ERROR_EMPTY_WAREHOUSE
            },
            ingredients,
        )
    }
}
