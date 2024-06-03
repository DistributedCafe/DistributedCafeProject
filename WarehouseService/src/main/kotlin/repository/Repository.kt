package repository
import WarehouseMessage
import domain.Ingredient

/**
 * Repository between the domain and the database
 */
interface Repository {
    /**
     * @return a list of all the ingredients and WarehouseMessage.OK
     */
    suspend fun getAllIngredients(): RepositoryResponse<List<Ingredient>>

    /**
     * @param name of the new ingredient
     * @param quantity of the new ingredient
     * @return WarehouseMessage.OK
     *      if the new ingredient has been successfully added,
     *      otherwise it returns WarehouseMessage.ERROR_INGREDIENT_ALREADY_EXISTS
     */
    suspend fun createIngredient(
        name: String,
        quantity: Int,
    ): WarehouseMessage

    /**
     * @param name of the ingredient to search for
     * @return WarehouseMessage.OK
     *      if the ingredient is in the warehouse,
     *      otherwise it returns WarehouseMessage.ERROR_INGREDIENT_NOT_FOUND
     */
    suspend fun isIngredientPresent(name: String): WarehouseMessage

    /**
     * @param name of the ingredient
     * @return the quantity of that ingredient and WarehouseMessage.OK
     *      if it's present in the warehouse,
     *      otherwise it returns null and WarehouseMessage.ERROR_INGREDIENT_NOT_FOUND
     */
    suspend fun getIngredientQuantity(name: String): RepositoryResponse<Int?>

    /**
     * @param name of the ingredient to update
     * @param quantity to remove from the warehouse
     * @return WarehouseMessage.OK
     *      if the new ingredient has been successfully updated,
     *      otherwise it returns WarehouseMessage.ERROR_INGREDIENT_NOT_FOUND
     */
    suspend fun decreaseIngredientQuantity(
        name: String,
        quantity: Int,
    ): WarehouseMessage

    /**
     * @param name of the ingredient to restock
     * @param quantity to add to the warehouse
     * @return WarehouseMessage.OK
     *      if the new ingredient has been successfully restocked,
     *      otherwise it returns WarehouseMessage.ERROR_INGREDIENT_NOT_FOUND
     */
    suspend fun restock(
        name: String,
        quantity: Int,
    ): WarehouseMessage

    /**
     * @return a list of all the available ingredients and WarehouseMessage.OK
     */
    suspend fun getAllAvailableIngredients(): RepositoryResponse<List<Ingredient>>
}
