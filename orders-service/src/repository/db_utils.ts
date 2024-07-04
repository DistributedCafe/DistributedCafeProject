import { Item, OrderItem, OrderType, OrderState, InsertOrder } from "../domain/order"
import { getOrdersCollection } from "./connection"

/**
 * Utility function to empty the database
 */
 export async function emptyOrders() {
    let collection = await getOrdersCollection()
    await collection.deleteMany()
 }
 
 /**
  * Utily function to 
  * @returns some samples items
  */
 export function getTestItems(){
    let i1: Item = {"name": "i1"}
    let i2: Item = {"name": "i2"}
    let ordersItem: OrderItem[] = [{"item": i1, "quantity": 2}, {"item": i2, quantity: 3}]
    return ordersItem
 }
 
  /**
  * Utily function to 
  * @returns some samples orders
  */
 export function getTestOrders(){
    
    let ordersItem = getTestItems()

    let o1 = toInsertOrder("c1", 1, OrderType.HOME_DELIVERY, OrderState.PENDING, ordersItem)

    let o2 = toInsertOrder("c2", 10, OrderType.AT_THE_TABLE, OrderState.COMPLETED, ordersItem)

    let o3 = toInsertOrder("c3", 1, OrderType.HOME_DELIVERY, OrderState.READY, ordersItem)

    let o4 = toInsertOrder("c4", 25, OrderType.TAKE_AWAY, OrderState.PENDING, [ordersItem[0]])

    return [o1, o2, o3, o4]

 }

 /**
  * Utily function to fill the database with the sample orders
  */
 export async function fillOrders(){

    let collection = await getOrdersCollection()
    await collection.insertMany(getTestOrders())
 }
 /**
  * @param customerContact 
  * @param price 
  * @param type 
  * @param state 
  * @param items 
  * @returns the order to insert in the database, the id is not provided
  */
 export function toInsertOrder(customerContact: string, price: number, type: OrderType, state: OrderState, items: OrderItem[]) : InsertOrder{
    return {
        customerContact: customerContact,
        price: price,
        type: type,
        state: state,
        items: items
    }
}