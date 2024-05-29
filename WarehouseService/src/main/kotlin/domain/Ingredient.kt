package domain

import kotlinx.serialization.Serializable

@Serializable
data class Ingredient(val name: String, val quantity: Int)