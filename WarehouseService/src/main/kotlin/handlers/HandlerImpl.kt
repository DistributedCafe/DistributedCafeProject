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
        val response =
            if (param == null) {
                WarehouseMessage.ERROR_WRONG_PARAMETERS
            } else if (!MongoUtils.isDbSuccessfullyConnected(mongoInfo)) {
                WarehouseMessage.ERROR_DB_NOT_AVAILABLE
            } else {
                warehouseService.createIngredient(Json.decodeFromString(param))
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
        val response =
            if (params == null) {
                WarehouseMessage.ERROR_WRONG_PARAMETERS
            } else if (!MongoUtils.isDbSuccessfullyConnected(mongoInfo)) {
                WarehouseMessage.ERROR_DB_NOT_AVAILABLE
            } else {
                try {
                    warehouseService.updateConsumedIngredientsQuantity(Json.decodeFromString(params))
                } catch (e: Exception) {
                    WarehouseMessage.ERROR_WRONG_PARAMETERS
                }
            }
        checkIfError(response, context)
        context.response().setStatusCode(WarehouseMessageToCode.convert(response)).end()
    }

    override suspend fun restock(context: RoutingContext) {
        val ingredientName = context.request().params().get("ingredient")
        val quantity = context.request().params().get("quantity")
        val response =
            if (ingredientName == null || quantity == null || quantity.toIntOrNull() == null) {
                WarehouseMessage.ERROR_WRONG_PARAMETERS
            } else if (!MongoUtils.isDbSuccessfullyConnected(mongoInfo)) {
                WarehouseMessage.ERROR_DB_NOT_AVAILABLE
            } else {
                warehouseService.restock(UpdateQuantity(ingredientName, quantity.toInt()))
            }

        checkIfError(response, context)
        context.response().setStatusCode(WarehouseMessageToCode.convert(response)).end()
    }
}
