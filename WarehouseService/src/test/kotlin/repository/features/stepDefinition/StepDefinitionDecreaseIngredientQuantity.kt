package repository.features.stepDefinition

import ApiUtils
import BaseTest
import domain.Ingredient
import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import io.vertx.kotlin.coroutines.coAwait
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.junit.jupiter.api.Assertions

class StepDefinitionDecreaseIngredientQuantity : BaseTest() {
    private var actualAnswer: String = ""
    private val apiUtils = ApiUtils(8080)

    @When("System decreases the {word} quantity by {word}")
    fun managerRestocksTea(
        name: String,
        quantity: String,
    ) {
        val decreaseIngredients = Json.encodeToString(listOf(Ingredient(name, quantity.toInt())))
        runBlocking {
            actualAnswer =
                apiUtils.updateConsumedIngredientsQuantity("ingredients", decreaseIngredients).send().coAwait().statusCode().toString()
        }
    }

    @Then("System receives {word}")
    fun managerReceivesResponse(expectedResponse: String) {
        Assertions.assertEquals(expectedResponse, actualAnswer)
    }
}
