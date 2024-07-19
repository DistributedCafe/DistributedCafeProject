import { OrderType, OrderItem, OrderState, Order } from '../domain/order'
import { OrdersMessage } from "../orders-message";
import * as mongoConnection from "./connection"
import { MongoOrder, toInsertOrder, fromMongoOrderToOrder } from './order-conversion-utils';
import { ObjectId } from "mongodb"

/**
 * This type represents the Response given by the repository. It consists of the generic data and an OrdersMessage
 */
type RepositoryResponse<T> = { data?: T, message: OrdersMessage };

let collection = mongoConnection.getOrdersCollection()

/**
 * Inserts a pending order into the repository with the provided information
 * @param customerContact of the ordering customer
 * @param price of the order
 * @param type of the order
 * @param items ordered
 * @returns a Promise with the repository response and the created Order as data
 */
export async function createOrder(customerContact: string, price: number, type: OrderType, items: OrderItem[]): Promise<RepositoryResponse<Order>> {

	let ordersCollection = await collection

	let newOrder = toInsertOrder(customerContact, price, type, OrderState.PENDING, items)

	let promise = await ordersCollection.insertOne(newOrder)
	let order = fromMongoOrderToOrder(promise.insertedId, customerContact, price, type, OrderState.PENDING, items)

	return { data: order, message: OrdersMessage.OK };

}

/**
 * It returs a Promise with the repository response and all the orders in the repository
 * @returns OrdersMessage.OK if there are orders, OrdersMessage.EMPTY_ORDERS_DB otherwise
 */
export async function getAllOrders(): Promise<RepositoryResponse<Order[]>> {

	let ordersCollection = await collection
	let mongoOrders = await ordersCollection.find().toArray() as MongoOrder[]
	let orders = mongoOrders.map((o) => fromMongoOrderToOrder(o._id, o.customerContact, o.price, o.type, o.state, o.items))

	if (orders.length > 0) {
		return { data: orders, message: OrdersMessage.OK }
	} else {
		return { data: orders, message: OrdersMessage.EMPTY_ORDERS_DB };
	}
}

export async function findOrderById(orderId: string): Promise<RepositoryResponse<Order>>{
	if (!ObjectId.isValid(orderId)){
		return {data: undefined, message: OrdersMessage.ORDER_ID_NOT_FOUND}
	}

	let ordersCollection = await collection
	let id = new ObjectId(orderId)
	let find = (await ordersCollection.find({"_id": id}).toArray())
	if (find.length == 0){
		return {data: undefined, message: OrdersMessage.ORDER_ID_NOT_FOUND}
	}
	let mongoOrder = find.at(0) as MongoOrder
	let order = fromMongoOrderToOrder(mongoOrder._id, mongoOrder.customerContact, mongoOrder.price, mongoOrder.type, mongoOrder.state, mongoOrder.items)
	return {data: order, message: OrdersMessage.OK}
	
}

export async function updateOrder(orderId: string, newState: OrderState): Promise<RepositoryResponse<Order>>{
	if(!ObjectId.isValid(orderId)){
		return {data: undefined, message: OrdersMessage.ORDER_ID_NOT_FOUND}
	}
	let filter = { "_id" : new ObjectId(orderId)}
	let update = { $set: { "state" : newState } }
	
	let ordersCollection = await collection
	let res = await ordersCollection.updateOne(filter, update)
	if(res.modifiedCount == 1){
		let order = (await findOrderById(orderId)).data
		return {data: order, message: OrdersMessage.OK}
	}else{
		return {data: undefined, message: OrdersMessage.ORDER_ID_NOT_FOUND}
	}

}


