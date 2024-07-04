import { ObjectId } from 'mongodb';
import {OrderType, OrderItem, OrderState, Order, Item, InsertOrder} from '../domain/order'
import { OrdersMessage } from "../orders-message";
import * as mongoConnection from "./connection"
import { toInsertOrder } from './db_utils';

type RepositoryResponse<T> = {data?: T, message: OrdersMessage};

let collection = mongoConnection.getOrdersCollection()

export async function createOrder(customerContact: string, price: number, type: OrderType, items: OrderItem[]): Promise<RepositoryResponse<Order>>{
    
    let ordersCollection = await collection

    let newOrder = toInsertOrder(customerContact, price, type,OrderState.PENDING, items)
    
    let promise = await ordersCollection.insertOne(newOrder)
    let order = toOrder(promise.insertedId.toString(), customerContact, price, type, OrderState.PENDING, items)

    return { data: order, message: OrdersMessage.OK };
        
}

export async function getAllOrders(): Promise<RepositoryResponse<Order[]>>{

    let ordersCollection = await collection
    let mongoOrders = await ordersCollection.find().toArray() as MongoOrder[]
    let orders = mongoOrders.map((o) => toOrder(o._id.toString(), o.customerContact, o.price, o.type, o.state, o.items))

    if (orders.length > 0){
        return { data: orders, message: OrdersMessage.OK }
    }else {
        return { data: orders, message: OrdersMessage.EMPTY_ORDERS_DB};
    } 
}

function toOrder(id: string, customerContact: string, price: number, type: OrderType, state: OrderState, items: OrderItem[]) : Order {
    return {
        _id: id,
        customerContact: customerContact,
        price: price,
        type: type,
        state: state,
        items: items
    } 
}

interface MongoOrder {
    _id: ObjectId,
    customerContact: string,
    price: number,
    type: OrderType,
    state: OrderState,
    items: OrderItem[]
}