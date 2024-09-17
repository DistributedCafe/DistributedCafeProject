/**
 * Data class that contains the information necessary to connect to the database
 * @param mongoAddress port to connect
 * @param databaseName name of the database
 * @param collectionName name of the collection
 */
data class MongoInfo(
    var mongoAddress: String = System.getenv("DB_CONNECTION_ADDRESS"),
    val databaseName: String = "Warehouse",
    val collectionName: String = "Ingredient",
)
