package application

import domain.Ingredient

data class IngredientsResponse(
    val response: WarehouseServiceResponse,
    val ingredients: List<Ingredient>
)

interface WarehouseService {

    /**
     * @return ... and all the ingredients
     */
    suspend fun getAllIngredients(): IngredientsResponse

    /**
     * @param name of the new ingredient
     * @param quantity of the new ingredient
     * @return if the new ingredient has been successfully added or not
     */
    suspend fun createIngredient(
        ingredient:Ingredient
    ): WarehouseServiceResponse

    /**
     * @param ingredients list of the consumed ingredients
     * @return if the ingredients have been successfully updated
     */
    suspend fun updateConsumedIngredientsQuantity(
        ingredients: List<Ingredient>
    ): WarehouseServiceResponse

    /**
     * @param name of the ingredient to restock
     * @param quantity to add to the warehouse
     * @return if the new ingredient has been successfully restocked
     */
    suspend fun restock(
        ingredient: Ingredient
    ): WarehouseServiceResponse

    /**
     * @return ... and all the available ingredients
     */
    suspend fun getAllAvailableIngredients(): IngredientsResponse

}