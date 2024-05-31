data class MongoOptions(
    val mongoAddress: String = "mongodb://localhost:27017/",
    val databaseName: String = "Warehouse",
    val collectionName: String = "Ingredient",
)
