package application

import domain.Ingredient

@kotlinx.serialization.Serializable
data class IngredientsResponse(
    val response: WarehouseServiceResponse,
    val ingredients: List<Ingredient>,
)

interface WarehouseService {
    /**
     * @return ... and all the ingredients
     */
    suspend fun getAllIngredients(): IngredientsResponse

    /**
     * @param ingredient to create
     * @return if the new ingredient has been successfully added or not
     */
    suspend fun createIngredient(ingredient: Ingredient): WarehouseServiceResponse

    /**
     * @param ingredients list of the consumed ingredients
     * @return if the ingredients have been successfully updated
     */
    suspend fun updateConsumedIngredientsQuantity(ingredients: List<Ingredient>): WarehouseServiceResponse

    /**
     * @param ingredient information needed to restock
     * @return if the new ingredient has been successfully restocked
     */
    suspend fun restock(ingredient: Ingredient): WarehouseServiceResponse

    /**
     * @return ... and all the available ingredients
     */
    suspend fun getAllAvailableIngredients(): IngredientsResponse
}
