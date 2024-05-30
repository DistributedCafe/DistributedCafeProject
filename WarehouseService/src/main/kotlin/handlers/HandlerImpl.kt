package handlers

import application.WarehouseServiceImpl
import application.WarehouseServiceResponse
import domain.Ingredient

import io.vertx.ext.web.RoutingContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json


class HandlerImpl: Handler {

    private val warehouseService = WarehouseServiceImpl()

    override suspend fun createIngredient(context: RoutingContext) {

        val param = context.request().params().get("ingredient")

        val ingredient = Json.decodeFromString<Ingredient>(param)

        val response = warehouseService.createIngredient(ingredient)


        context.response().setStatusCode(toCode(response)).end()

    }

    override suspend fun getAllIngredients(context: RoutingContext) {
        val response = warehouseService.getAllIngredients()
        context.response().setStatusCode(toCode(response.response)).end(Json.encodeToString(response.ingredients))
    }

    private fun toCode(response: WarehouseServiceResponse): Int{
        return if (response == WarehouseServiceResponse.OK) 200 else 403
    }
}