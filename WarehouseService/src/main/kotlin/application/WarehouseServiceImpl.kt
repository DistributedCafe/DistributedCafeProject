package application

import domain.Ingredient
import repository.RepositoryImpl
import repository.WarehouseResponse

class WarehouseServiceImpl : WarehouseService {
    private val repository = RepositoryImpl()

    override suspend fun getAllIngredients(): IngredientsResponse {
        val ingredients = repository.getAllIngredients()
        return correctIngredientList(ingredients)
    }

    override suspend fun createIngredient(ingredient: Ingredient): WarehouseServiceResponse {
        val response = repository.createIngredient(ingredient.name, ingredient.quantity)
        return mapResponse(response)

    }

    override suspend fun updateConsumedIngredientsQuantity(ingredients: List<Ingredient>): WarehouseServiceResponse {
        ingredients.forEach{
            if (repository.getAllAvailableIngredients().none { i -> i.name == it.name && it.quantity <= i.quantity })
                return WarehouseServiceResponse.ERROR
        }

        ingredients.forEach{
                i -> repository.decreaseIngredientQuantity(i.name, i.quantity)
        }
        return WarehouseServiceResponse.OK
    }

    override suspend fun restock(ingredient: Ingredient): WarehouseServiceResponse {
        val response = repository.restock(ingredient.name, ingredient.quantity)
        return mapResponse(response)
    }

    override suspend fun getAllAvailableIngredients(): IngredientsResponse {
        val ingredients = repository.getAllAvailableIngredients()
        return correctIngredientList(ingredients)
    }

    private fun mapResponse(repositoryResponse: WarehouseResponse): WarehouseServiceResponse{
        return if (repositoryResponse == WarehouseResponse.OK){
            WarehouseServiceResponse.OK
        }else{
            WarehouseServiceResponse.ERROR
        }
    }

    private fun correctIngredientList(ingredients: List<Ingredient>): IngredientsResponse {
        return if (ingredients.isNotEmpty()){
            IngredientsResponse(WarehouseServiceResponse.OK, ingredients)
        }else {
            IngredientsResponse(WarehouseServiceResponse.ERROR, ingredients)
        }
    }

}