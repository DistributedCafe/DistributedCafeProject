import * as mongoDB from "mongodb"

/**
 * Mongo Client
 */
const DB_CONN_STRING = "mongodb://localhost:27017"
const DB_NAME = "Orders"
const COLLECTION_NAME = "Orders"

const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING)

/**
 * Add an order into the datatbase
 * @param order that has to added
 * @returns the new order informations 
 */
export async function addOrder(order: string) {
	await client.connect()

	return client.db(DB_NAME).collection(COLLECTION_NAME).insertOne(JSON.parse(order))
}

/**
 * Delete all the orders present in the collection
 */
export async function cleanCollection() {
	await client.connect()

	client.db(DB_NAME).collection(COLLECTION_NAME).deleteMany()
}

/**
  * Utility function to get the last inserted Order
  * @returns the last inserted Order
  */
export async function getLastInsertedOrder() {
	await client.connect()

	let orders = (await client.db(DB_NAME).collection(COLLECTION_NAME)).find()
	let last = (await orders.toArray()).pop()
	return last
}

/**
 * Closes the connection
 */
export function closeMongoClient() {
	client.close()
}
