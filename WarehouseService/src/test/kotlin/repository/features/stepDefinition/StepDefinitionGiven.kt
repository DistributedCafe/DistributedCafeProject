package repository.features.stepDefinition

import com.mongodb.client.model.Filters
import com.mongodb.kotlin.client.coroutine.MongoClient
import io.cucumber.java.en.Given
import kotlinx.coroutines.runBlocking
import repository.Ingredient

class StepDefinitionGiven() {
    private val mongoAddress = "mongodb://localhost:27017/"

    private val db = MongoClient.create(mongoAddress).getDatabase("Warehouse")
    private val collection = db.getCollection<Ingredient>("Ingredient")

    private val ingredients = listOf(Ingredient("milk", 99), Ingredient("tea", 4))

    @Given("there are 99 units of milk and 4 units of tea in the warehouse")
    fun thereAre99UnitsOfMilkAnd4UnitsOfTeaInTheWarehouse() {
        runBlocking {
            collection.deleteMany(Filters.empty())
            collection.insertMany(ingredients)
        }
    }
}
