import * as mongoDB from "mongodb"

/**
 * Mongo Client
 */
const DB_CONN_STRING = "mongodb://localhost:27017"
const DB_NAME = "Orders"
const COLLECTION_NAME = "Orders"

const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING)

/**
 * @returns the orders collection 
 */
export async function getOrdersCollection() {

    await client.connect()

    return client.db(DB_NAME).collection(COLLECTION_NAME)
}

/**
 * Closes the connection
 */
export function closeMongoClient() {
    client.close()
}


