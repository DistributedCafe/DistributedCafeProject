package repository

import com.mongodb.client.model.Filters
import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import io.vertx.core.*
import io.vertx.kotlin.core.http.httpServerOptionsOf
import io.vertx.kotlin.coroutines.CoroutineVerticle
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.toList
import java.util.logging.Filter
import java.util.stream.Stream


class RepositoryImpl(mongoAddress: String) : Repository{

    val mongoClient = MongoClient.create(mongoAddress)
    val db = mongoClient.getDatabase("Warehouse")

    override suspend fun getAllIngredients(): List<Ingredient> {
        return db.getCollection<Ingredient>("Ingredient").find<Ingredient>().toList()
    }

    override suspend fun createIngredient(name: String, quantity: Int): WarehouseResponse {
        TODO("Not yet implemented")
    }

    override suspend fun isIngredientPresent(name: String): Boolean {
        TODO("Not yet implemented")
    }

    override suspend fun getIngredientQuantity(name: String): Int {
        TODO("Not yet implemented")
    }

    override suspend fun restock(name: String, quantity: Int): WarehouseResponse {
        TODO("Not yet implemented")
    }

    override suspend fun getAllAvailableIngredients(): List<Ingredient> {
        TODO("Not yet implemented")
    }
}