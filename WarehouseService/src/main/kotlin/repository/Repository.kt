package repository

/**
 * Repository between the domain and the database
 */
interface Repository {
    /**
     * @return all the ingredients
     */
    suspend fun getAllIngredients(): List<Ingredient>

    /**
     * @param name of the new ingredient
     * @param quantity of the new ingredient
     * @return if the new ingredient has been successfully added or not
     */
    suspend fun createIngredient(
        name: String,
        quantity: Int,
    ): WarehouseResponse

    /**
     * @param name of the ingredient to search for
     * @return true if the ingredient is in the warehouse, false otherwise
     */
    suspend fun isIngredientPresent(name: String): Boolean

    /**
     * @param name of the ingredient
     * @return the quantity of that ingredient if it's present in the warehouse, otherwise it returns null
     */
    suspend fun getIngredientQuantity(name: String): Int?

    /**
     * @param name of the ingredient to update
     * @param quantity to remove from the warehouse
     * @return if the new ingredient has been successfully updated
     */
    suspend fun decreaseIngredientQuantity(
        name: String,
        quantity: Int,
    ): WarehouseResponse

    /**
     * @param name of the ingredient to restock
     * @param quantity to add to the warehouse
     * @return if the new ingredient has been successfully restocked
     */
    suspend fun restock(
        name: String,
        quantity: Int,
    ): WarehouseResponse

    /**
     * @return all the available ingredients
     */
    suspend fun getAllAvailableIngredients(): List<Ingredient>
}
