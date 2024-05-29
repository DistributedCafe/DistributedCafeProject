package handlers

import application.WarehouseServiceImpl
import application.WarehouseServiceResponse
import domain.Ingredient

import io.vertx.ext.web.RoutingContext
import kotlinx.serialization.json.Json


class HandlerImpl: Handler {

    private val warehouseService = WarehouseServiceImpl()

    override suspend fun createIngredient(context: RoutingContext) {

        val param = context.request().params().get("ingredient")

        val ingredient = Json.decodeFromString<Ingredient>(param)

        println(ingredient)

        val response = warehouseService.createIngredient(ingredient)

        println(response)

        val code = if (response == WarehouseServiceResponse.OK) 200 else 403
        context.response().setStatusCode(code).end(response.toString())

    }
}