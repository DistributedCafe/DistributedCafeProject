import { InsertOrder, Order, OrderItem, OrderType } from "../domain/order";
import { OrdersMessage } from "../orders-message";
import * as repository from "../repository/repository";

type ServiceResponse<T> = {data?: T, message: OrdersMessage};

export async function addNewOrder(customerContact: string, price: number, type: OrderType, items: OrderItem[]): Promise<ServiceResponse<Order>>{
    let res = await repository.createOrder(customerContact, price, type, items)
    return { data: res.data, message: res.message }

}

export async function getAllOrders(): Promise<ServiceResponse<Order[]>>{
    let res = await repository.getAllOrders()
    return {data: res.data, message: res.message}
}