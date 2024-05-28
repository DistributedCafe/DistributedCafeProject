package repository.features.stepDefinition

import MongoOptions
import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions
import domain.Ingredient
import repository.RepositoryImpl

class StepDefinitionGetAllIngredients {


    private val warehouse = RepositoryImpl(MongoOptions())

    private var actualAnswer: List<Ingredient> = ArrayList()
    private val ingredients = listOf(Ingredient("milk", 99), Ingredient("tea", 4))

    @When("Manager asks for the list of ingredients in the warehouse")
    fun managerAsksForTheListOfIngredientsInTheWarehouse() {
        runBlocking { actualAnswer = warehouse.getAllIngredients() }
    }

    @When("Manager asks for the list of available ingredients in the warehouse")
    fun managerAsksForTheListOfAvailableIngredientsInTheWarehouse() {
        runBlocking { actualAnswer = warehouse.getAllAvailableIngredients() }
    }

    @Then("Manager receives a list of ingredients with only milk and tea")
    fun managerReceives() {
        Assertions.assertEquals(ingredients, actualAnswer)
    }
}
