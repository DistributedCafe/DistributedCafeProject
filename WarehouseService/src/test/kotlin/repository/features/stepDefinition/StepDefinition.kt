package repository.features.stepDefinition

import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions
import repository.RepositoryImpl

class StepDefinition {

    private val warehouse = RepositoryImpl()
    private var actualAnswer: String = ""

    @When("Manager adds an ingredient with name {word} and quantity {word}")
    fun managerAddsAnIngredient(
        name: String,
        quantity: String,
    ) {
        runBlocking { actualAnswer = warehouse.createIngredient(name, quantity.toInt()).toString() }
    }

    @When("Manager asks the quantity of the {word}")
    fun managerAsksTheQuantityOfTheMilk(name: String) {
        runBlocking {
            actualAnswer = warehouse.getIngredientQuantity(name).toString()
        }
    }

    @When("Manager asks if {word} is present")
    fun managerAsksIfMilkIsPresent(name: String) {
        runBlocking { actualAnswer = warehouse.isIngredientPresent(name).toString() }
    }

    @When("Manager restocks the {word} adding {word} units")
    fun managerRestocksTea(
        name: String,
        quantity: String,
    ) {
        runBlocking {
            actualAnswer = warehouse.restock(name, quantity.toInt()).toString()
        }
    }

    @Then("Manager receives {word}")
    fun managerReceivesResponse(expectedResponse: String) {
        Assertions.assertEquals(expectedResponse, actualAnswer)
    }
}
