import { ObjectId } from "mongodb"
import { OrderItem, OrderType, OrderState, InsertOrder, Order } from "../domain/order"

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

export function fromMongoOrderToOrder(id: ObjectId, customerContact: string, price: number, type: OrderType, state: OrderState, items: OrderItem[]) : Order {
   return {
       _id: id.toString(),
       customerContact: customerContact,
       price: price,
       type: type,
       state: state,
       items: items
   } 
}

export function removeIndexOrder(order: Order): InsertOrder{
    return toInsertOrder(order.customerContact, order.price, order.type, order.state, order.items)
}

export interface MongoOrder {
   _id: ObjectId,
   customerContact: string,
   price: number,
   type: OrderType,
   state: OrderState,
   items: OrderItem[]
}


