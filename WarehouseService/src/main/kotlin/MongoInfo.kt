/**
 * Data class that contains the information necessary to connect to the database
 * @param mongoAddress port to connect
 * @param databaseName name of the database
 * @param collectionName name of the collection
 */
data class MongoInfo(
    var mongoAddress: String = "mongodb://localhost:27017/",
    val databaseName: String = "Warehouse",
    val collectionName: String = "Ingredient",
)
