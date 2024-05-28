package repository.features.stepDefinition

import MongoOptions
import com.mongodb.client.model.Filters
import com.mongodb.kotlin.client.coroutine.MongoClient
import io.cucumber.java.en.Given
import kotlinx.coroutines.runBlocking
import domain.Ingredient

class StepDefinitionGiven {
    private val mongoOptions = MongoOptions()

    private val db = MongoClient.create(mongoOptions.mongoAddress).getDatabase(mongoOptions.databaseName)
    private val collection = db.getCollection<Ingredient>(mongoOptions.collectionName)

    private val ingredients = listOf(Ingredient("milk", 99), Ingredient("tea", 4))

    @Given("there are 99 units of milk and 4 units of tea in the warehouse")
    fun thereAre99UnitsOfMilkAnd4UnitsOfTeaInTheWarehouse() {
        runBlocking {
            collection.deleteMany(Filters.empty())
            collection.insertMany(ingredients)
        }
    }

    @Given("there are 99 units of milk, 4 units of tea and 0 unit of coffee in the warehouse")
    fun thereAre99UnitsOfMilk4UnitsOfTeaAnd0UnitOfCoffeeInTheWarehouse() {
        thereAre99UnitsOfMilkAnd4UnitsOfTeaInTheWarehouse()
        runBlocking {
            collection.insertOne(Ingredient("coffee", 0))
        }
    }
}
