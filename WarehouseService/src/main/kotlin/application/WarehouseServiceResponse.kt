package application

import WarehouseMessage
import domain.Ingredient

/**
 * Data class representing the response of the WarehouseService
 * @param response returned by the WarehouseService
 * @param ingredients list of ingredients
 */
data class WarehouseServiceResponse(
    val response: WarehouseMessage,
    val ingredients: List<Ingredient>,
)
