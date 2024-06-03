package handlers

import MongoInfo
import WarehouseMessage
import WarehouseMessageToCode
import application.UpdateQuantity
import application.WarehouseServiceImpl
import domain.Ingredient
import io.vertx.ext.web.RoutingContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import server.MongoUtils

class HandlerImpl(private val mongoInfo: MongoInfo) : Handler {
    private val warehouseService = WarehouseServiceImpl(mongoInfo)

    override suspend fun createIngredient(context: RoutingContext) {
        val param = context.request().params().get("ingredient")

        val ingredient = Json.decodeFromString<Ingredient>(param)

        val response =
            if (MongoUtils.isDbSuccessfullyConnected(mongoInfo)) {
                warehouseService.createIngredient(ingredient)
            } else {
                WarehouseMessage.ERROR_DB_NOT_AVAILABLE
            }
        context.response().setStatusCode(WarehouseMessageToCode.convert(response)).end()
    }

    override suspend fun getAllIngredients(context: RoutingContext) {
        if (MongoUtils.isDbSuccessfullyConnected(mongoInfo)) {
            val response = warehouseService.getAllIngredients()
            context.response().setStatusCode(
                WarehouseMessageToCode.convert(response.response),
            ).end(Json.encodeToString(response.ingredients))
        } else {
            context.response().setStatusCode(WarehouseMessageToCode.convert(WarehouseMessage.ERROR_DB_NOT_AVAILABLE)).end()
        }
    }

    override suspend fun getAllAvailableIngredients(context: RoutingContext) {
        if (MongoUtils.isDbSuccessfullyConnected(mongoInfo)) {
            val response = warehouseService.getAllAvailableIngredients()
            context.response().setStatusCode(
                WarehouseMessageToCode.convert(response.response),
            ).end(Json.encodeToString(response.ingredients))
        } else {
            context.response().setStatusCode(WarehouseMessageToCode.convert(WarehouseMessage.ERROR_DB_NOT_AVAILABLE)).end()
        }
    }

    override suspend fun updateConsumedIngredientsQuantity(context: RoutingContext) {
        val params = context.request().params().get("ingredients")
        val ingredients = Json.decodeFromString<List<UpdateQuantity>>(params)
        val response =
            if (MongoUtils.isDbSuccessfullyConnected(mongoInfo)) {
                warehouseService.updateConsumedIngredientsQuantity(ingredients)
            } else {
                WarehouseMessage.ERROR_DB_NOT_AVAILABLE
            }
        context.response().setStatusCode(WarehouseMessageToCode.convert(response)).end()
    }

    override suspend fun restock(context: RoutingContext) {
        val ingredientName = context.request().params().get("ingredient")
        val quantity = context.request().params().get("quantity")
        val response =
            if (MongoUtils.isDbSuccessfullyConnected(mongoInfo)) {
                warehouseService.restock(UpdateQuantity(ingredientName, quantity.toInt()))
            } else {
                WarehouseMessage.ERROR_DB_NOT_AVAILABLE
            }
        context.response().setStatusCode(WarehouseMessageToCode.convert(response)).end()
    }
}
