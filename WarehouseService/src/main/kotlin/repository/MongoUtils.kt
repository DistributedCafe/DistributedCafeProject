package repository

import MongoOptions
import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoCollection
import domain.Ingredient

object MongoUtils {
    fun getMongoCollection(mongoOptions: MongoOptions): MongoCollection<Ingredient>{
        val mongoClient = MongoClient.create(mongoOptions.mongoAddress)
        val db = mongoClient.getDatabase(mongoOptions.databaseName)
        return db.getCollection(mongoOptions.collectionName)
    }
}