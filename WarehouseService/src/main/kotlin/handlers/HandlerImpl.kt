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

    override suspend fun getAllAvailableIngredients(context: RoutingContext) {
        val response = warehouseService.getAllAvailableIngredients()
        context.response().setStatusCode(toCode(response.response)).end(Json.encodeToString(response.ingredients))
    }

    override suspend fun updateConsumedIngredientsQuantity(context: RoutingContext) {
        val params = context.request().params().get("ingredients")
        val ingredients = Json.decodeFromString<List<Ingredient>>(params)
        val response = warehouseService.updateConsumedIngredientsQuantity(ingredients)
        context.response().setStatusCode(toCode(response)).end()
    }

    override suspend fun restock(context: RoutingContext) {
        val ingredientName = context.request().params().get("ingredient")
        val quantity = context.request().params().get("quantity")
        val response = warehouseService.restock(Ingredient(ingredientName, quantity.toInt()))
        context.response().setStatusCode(toCode(response)).end()
    }

    private fun toCode(response: WarehouseServiceResponse): Int{
        return if (response == WarehouseServiceResponse.OK) 200 else 403
    }
}