package repository

data class Ingredient(val name: String, val quantity: Int)

data class Quantity(val quantity: Int)

enum class WarehouseResponse {
    OK,
    ERROR,
}
