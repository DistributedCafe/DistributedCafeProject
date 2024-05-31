import com.mongodb.client.model.Filters
import domain.Ingredient
import io.kotest.core.spec.style.AnnotationSpec
import repository.MongoUtils

open class BaseTest : AnnotationSpec() {
    protected val collection = MongoUtils.getMongoCollection(MongoOptions())
    protected val milk = Ingredient("milk", 99)
    protected val tea = Ingredient("tea", 4)
    protected val coffee = Ingredient("coffee", 1)
    protected val notAvailableCoffee = Ingredient(coffee.name, 0)
    protected val ingredients = listOf(milk, tea)

    @BeforeEach
    suspend fun beforeTest() {
        collection.deleteMany(Filters.empty())
        collection.insertMany(ingredients)
    }
}
