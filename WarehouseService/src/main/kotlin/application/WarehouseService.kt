package application

import WarehouseMessage
import domain.Ingredient

interface WarehouseService {
    /**
     * @return a list of all the ingredients in the warehouse and WarehouseMessage.OK
     *      if the list is not empty,
     *      otherwise it returns an empty list and WarehouseMessage.ERROR_EMPTY_WAREHOUSE
     */
    suspend fun getAllIngredients(): WarehouseServiceResponse

    /**
     * @param ingredient to create
     * @return the repository response
     */
    suspend fun createIngredient(ingredient: Ingredient): WarehouseMessage

    /**
     * @param ingredients list of the consumed ingredients
     * @return WarehouseMessage.OK
     *      if all the consumed ingredients are updated,
     *      WarehouseMessage.ERROR_INGREDIENT_QUANTITY
     *          if a quantity is greater than the actual quantity of the consumed ingredient in the warehouse,
     *      WarehouseMessage.ERROR_INGREDIENT_NOT_FOUND
     *          if one consumed ingredient is not found in the warehouse
     */
    suspend fun updateConsumedIngredientsQuantity(ingredients: List<Ingredient>): WarehouseMessage

    /**
     * @param ingredient information needed to restock
     * @return the repository response
     */
    suspend fun restock(ingredient: Ingredient): WarehouseMessage

    /**
     * @return a list of all the available ingredients in the warehouse and WarehouseMessage.OK
     *      if the list is not empty,
     *      otherwise it returns an empty list and WarehouseMessage.ERROR_EMPTY_WAREHOUSE
     */
    suspend fun getAllAvailableIngredients(): WarehouseServiceResponse
}
