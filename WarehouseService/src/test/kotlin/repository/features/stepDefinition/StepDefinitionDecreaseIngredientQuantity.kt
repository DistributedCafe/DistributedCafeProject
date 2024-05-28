package repository.features.stepDefinition

import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions
import repository.RepositoryImpl

class StepDefinitionDecreaseIngredientQuantity {
    private val mongoAddress = "mongodb://localhost:27017/"
    private val warehouse = RepositoryImpl(mongoAddress)
    private var actualAnswer: String = ""

    @When("System decreases the {word} quantity by {word}")
    fun managerRestocksTea(
        name: String,
        quantity: String,
    ) {
        runBlocking {
            actualAnswer = warehouse.decreaseIngredientQuantity(name, quantity.toInt()).toString()
        }
    }

    @Then("System receives {word}")
    fun managerReceivesResponse(expectedResponse: String) {
        Assertions.assertEquals(expectedResponse, actualAnswer)
    }
}
