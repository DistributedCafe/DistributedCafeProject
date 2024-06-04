package application

import WarehouseMessage

/**
 * Data class representing the response of the WarehouseService
 * @param ingredients list of ingredients
 * @param response returned by the WarehouseService
 */
data class WarehouseServiceResponse<Data>(
    val ingredients: Data?,
    val response: WarehouseMessage,
)
