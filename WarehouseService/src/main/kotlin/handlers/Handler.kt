package handlers

import io.vertx.ext.web.RoutingContext

interface Handler {

    suspend fun createIngredient(context: RoutingContext)

    suspend fun getAllIngredients(context: RoutingContext)
}