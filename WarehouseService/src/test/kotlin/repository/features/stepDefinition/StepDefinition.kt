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

class StepDefinition : BaseTest() {
    private var actualAnswer: String = ""
    private val apiUtils = ApiUtils(8080)

    @When("Manager adds an ingredient with name {word} and quantity {word}")
    fun managerAddsAnIngredient(
        name: String,
        quantity: String,
    ) {
        val ingredient = Ingredient(name, quantity.toInt())
        runBlocking {
            actualAnswer =
                apiUtils.createIngredient(Json.encodeToString(ingredient)).send().coAwait().statusCode().toString()
        }
    }

    @When("Manager restocks the {word} adding {word} units")
    fun managerRestocks(
        name: String,
        quantity: String,
    ) {
        runBlocking {
            actualAnswer =
                apiUtils.restock(name, Json.encodeToString(quantity.toInt())).send().coAwait().statusCode().toString()
        }
    }

    @When("Manager asks for the list of ingredients in the warehouse")
    fun managerAsksForTheListOfIngredientsInTheWarehouse() {
        runBlocking {
            actualAnswer =
                apiUtils.getAllIngredients("").send().coAwait().statusCode().toString()
        }
    }

    @When("Manager asks for the list of available ingredients in the warehouse")
    fun managerAsksForTheListOfAvailableIngredientsInTheWarehouse() {
        runBlocking {
            actualAnswer =
                apiUtils.getAllIngredients("available").send().coAwait().statusCode().toString()
        }
    }

    @Then("Manager receives {word}")
    fun managerReceivesResponse(expectedResponse: String) {
        Assertions.assertEquals(expectedResponse, actualAnswer)
    }
}
