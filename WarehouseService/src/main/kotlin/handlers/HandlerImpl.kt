package handlers

import MongoInfo
import WarehouseMessage
import WarehouseMessageToCode
import application.UpdateQuantity
import application.WarehouseServiceImpl
import application.WarehouseServiceResponse
import domain.Ingredient
import io.vertx.core.http.HttpServerResponse
import io.vertx.ext.web.RoutingContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import server.MongoUtils
import java.net.HttpURLConnection

class HandlerImpl(private val mongoInfo: MongoInfo) : Handler {
    private val warehouseService = WarehouseServiceImpl(mongoInfo)

    private fun checkIfError(
        response: WarehouseMessage,
        context: RoutingContext,
    ) {
        if (WarehouseMessageToCode.convert(response) != HttpURLConnection.HTTP_OK) {
            context.response().statusMessage = response.toString()
        }
    }

    override suspend fun createIngredient(context: RoutingContext) {
        val param = context.request().params().get("ingredient")

        val ingredient = Json.decodeFromString<Ingredient>(param)

        val response =
            if (MongoUtils.isDbSuccessfullyConnected(mongoInfo)) {
                warehouseService.createIngredient(ingredient)
            } else {
                WarehouseMessage.ERROR_DB_NOT_AVAILABLE
            }
        checkIfError(response, context)
        context.response().setStatusCode(WarehouseMessageToCode.convert(response)).end()
    }

    override suspend fun getAllIngredients(context: RoutingContext) {
        getIngredients(warehouseService.getAllIngredients(), context)
    }

    private fun setBody(
        ingredients: List<Ingredient>,
        res: HttpServerResponse,
    ) {
        if (ingredients.isEmpty()) {
            res.end()
        } else {
            res.end(Json.encodeToString(ingredients))
        }
    }

    private suspend fun getIngredients(
        warehouseServiceResponse: WarehouseServiceResponse,
        context: RoutingContext,
    ) {
        val response =
            if (MongoUtils.isDbSuccessfullyConnected(mongoInfo)) {
                warehouseServiceResponse.response
            } else {
                WarehouseMessage.ERROR_DB_NOT_AVAILABLE
            }
        checkIfError(response, context)
        val res = context.response().setStatusCode(WarehouseMessageToCode.convert(response))
        setBody(warehouseServiceResponse.ingredients, res)
    }

    override suspend fun getAllAvailableIngredients(context: RoutingContext) {
        getIngredients(warehouseService.getAllAvailableIngredients(), context)
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
        checkIfError(response, context)
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
        checkIfError(response, context)
        context.response().setStatusCode(WarehouseMessageToCode.convert(response)).end()
    }
}
