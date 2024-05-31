package repository.features.stepDefinition

import MongoOptions
import com.mongodb.client.model.Filters
import domain.Ingredient
import io.cucumber.java.en.Given
import kotlinx.coroutines.runBlocking
import repository.MongoUtils

class StepDefinitionGiven {
    private val collection = MongoUtils.getMongoCollection(MongoOptions())

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
