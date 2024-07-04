import { Item, OrderItem, OrderType, OrderState, InsertOrder } from "../domain/order"
import { getOrdersCollection } from "./connection"

 export async function emptyOrders() {
    let collection = await getOrdersCollection()
    await collection.deleteMany()
 }
 
 export function getTestItems(){
    let i1: Item = {"name": "i1"}
    let i2: Item = {"name": "i2"}
    let ordersItem: OrderItem[] = [{"item": i1, "quantity": 2}, {"item": i2, quantity: 3}]
    return ordersItem
 }
 
 export function getTestOrders(){
    
    let ordersItem = getTestItems()

    let o1 = {
        customerContact: "c1",
        price: 1,
        type: OrderType.HOME_DELIVERY,
        state: OrderState.PENDING,
        items: ordersItem
    }

    let o2 = {
        customerContact: "c2",
        price: 10,
        type: OrderType.AT_THE_TABLE,
        state: OrderState.COMPLETED,
        items: ordersItem
    }

    let o3 = {
        customerContact: "c3",
        price: 1,
        type: OrderType.HOME_DELIVERY,
        state: OrderState.READY,
        items: ordersItem
    }

    let o4 = {
        customerContact: "c4",
        price: 25,
        type: OrderType.AT_THE_TABLE,
        state: OrderState.PENDING,
        items: [ordersItem[0]]
    }

    return [o1, o2, o3, o4]

 }

 export async function fillOrders(){

    let collection = await getOrdersCollection()
    await collection.insertMany(getTestOrders())
 }

 export function toInsertOrder(customerContact: string, price: number, type: OrderType, state: OrderState, items: OrderItem[]) : InsertOrder{
    return {
        customerContact: customerContact,
        price: price,
        type: type,
        state: state,
        items: items
    }
}