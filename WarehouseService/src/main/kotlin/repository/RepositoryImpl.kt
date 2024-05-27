package repository

import com.mongodb.MongoException
import com.mongodb.client.model.Filters
import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Projections
import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoClient
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList

class RepositoryImpl(mongoAddress: String) : Repository {
    private val mongoClient = MongoClient.create(mongoAddress)
    private val db = mongoClient.getDatabase("Warehouse")
    private val collection = db.getCollection<Ingredient>("Ingredient")

    override suspend fun getAllIngredients(): List<Ingredient> {
        return collection.find<Ingredient>().toList()
    }

    override suspend fun createIngredient(
        name: String,
        quantity: Int,
    ): WarehouseResponse {
        return try {
            collection.insertOne(Ingredient(name, quantity)).wasAcknowledged()
            WarehouseResponse.OK
        } catch (e: MongoException) {
            WarehouseResponse.ERROR
        }
    }

    override suspend fun isIngredientPresent(name: String): Boolean {
        return collection.find(eq(Ingredient::name.name, name)).toList().isNotEmpty()
    }

    override suspend fun getIngredientQuantity(name: String): Int? {
        val projectionQuantity = Projections.fields(Projections.include(Ingredient::quantity.name))
        // TODO error management (not return 0)
        return collection.withDocumentClass<Quantity>().find(eq(Ingredient::name.name, name)).projection(projectionQuantity).firstOrNull()?.quantity
    }

    private suspend fun updateIngredientQuantity(name: String, quantity: Int): WarehouseResponse{
        val oldQuantity = getIngredientQuantity(name)
        return if ( oldQuantity != null){
            val filter = eq(Ingredient::name.name, name)
            val updates = Updates.combine(Updates.set(Ingredient::quantity.name, oldQuantity + quantity))
            val res = collection.updateOne(filter, updates)
            if (res.modifiedCount > 0){
                WarehouseResponse.OK
            }else{
                WarehouseResponse.ERROR
            }
        }else {
            WarehouseResponse.ERROR
        }
    }

    override suspend fun decreaseIngredientQuantity(name: String, quantity: Int): WarehouseResponse {
        TODO("Not yet implemented")
    }

    override suspend fun restock(
        name: String,
        quantity: Int,
    ): WarehouseResponse {
        return updateIngredientQuantity(name, quantity)
    }

    override suspend fun getAllAvailableIngredients(): List<Ingredient> {
        TODO("Not yet implemented")
    }
}
