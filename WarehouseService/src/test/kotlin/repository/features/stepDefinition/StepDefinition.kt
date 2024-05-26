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
    private val mongoAddress = "mongodb://localhost:27017/"

    private val db = MongoClient.create(mongoAddress).getDatabase("Warehouse")
    private val collection = db.getCollection<Ingredient>("Ingredient")

    private val warehouse = RepositoryImpl(mongoAddress)

    private var actualAnswer : List<Ingredient> = ArrayList()
    private val ingredients = listOf(Ingredient("milk", 99), Ingredient("tea", 4))


    @Given("only milk and tea are in the warehouse")
        fun milkAndTeaInTheWarehouse() {

        runBlocking {

            collection.deleteMany(Filters.empty())
            collection.insertMany(ingredients)

        }

        }

    @When("Manager asks for the list of ingredients in the warehouse")
    fun managerAsksForTheListOfIngredientsInTheWarehouse() {
        runBlocking { actualAnswer = warehouse.getAllIngredients() }
    }

    @Then("Manager receives a list of ingredients with only milk and tea")
    fun managerReceives() {

        assertEquals(ingredients, actualAnswer)
    }


}