package repository.features.stepDefinition

import com.mongodb.client.model.Filters
import com.mongodb.kotlin.client.coroutine.MongoClient
import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import io.cucumber.java.en.Given
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import repository.Ingredient
import repository.RepositoryImpl

class StepDefinition {
    val mongoAddress = "mongodb://localhost:27017/"

    val db = MongoClient.create(mongoAddress).getDatabase("Warehouse")
    val collection = db.getCollection<Ingredient>("Ingredient")

    val warehouse = RepositoryImpl(mongoAddress)

    private var actualAnswer : List<Ingredient> = ArrayList()

    @Given("milk and tea are in the warehouse")
        fun milkAndTeaInTheWarehouse() {

        val ingredients = listOf(Ingredient("milk", 99), Ingredient("tea", 4))

        runBlocking {

            collection.deleteMany(Filters.empty())
            collection.insertMany(ingredients)

        }

        }

    @When("Manager asks for the list of ingredients in the warehouse")
    fun managerAsksForTheListOfIngredientsInTheWarehouse() {
        runBlocking { actualAnswer = warehouse.getAllIngredients() }
    }

    @Then("Manager receives")
    fun managerReceives(expectedAnswer: List<String>) {
        assertEquals(expectedAnswer, actualAnswer.map { i -> i.name })
    }
}
