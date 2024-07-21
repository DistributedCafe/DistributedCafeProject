import { Order, OrderItem, OrderState, OrderType } from "../domain/order";
import { OrdersMessage } from "../orders-message";
import * as repository from "../repository/repository";

/**
 * This type represents the Response given by the Service. It consists of the generic data and an OrdersMessage
 */
type ServiceResponse<T> = { data?: T, message: OrdersMessage };

/**
 * Service functionality to add a new order given its information:
 * @param customerContact 
 * @param price 
 * @param type 
 * @param items 
 * @returns a Promise with the Service Response containing the new Order data and an OK message 
 */
export async function addNewOrder(customerContact: string, price: number, type: OrderType, items: OrderItem[]): Promise<ServiceResponse<Order>> {
	let res = await repository.createOrder(customerContact, price, type, items)
	return { data: res.data, message: res.message }

}

/**
 * Service functionality to get all the received orders
 * @returns all the received orders
 */
export async function getAllOrders(): Promise<ServiceResponse<Order[]>> {
	let res = await repository.getAllOrders()
	return { data: res.data, message: res.message }
}

/**
 * Service functionality to get a specific order given the id.
 * @param orderId the id of the order
 * @returns the repository response.
 */
export async function getOrderById(orderId: string): Promise<ServiceResponse<Order>> {
	let res = await repository.findOrderById(orderId)
	return { data: res.data, message: res.message }
}

/**
 * Service functionality to update a specific existing order to a new state.
 * @param orderId
 * @param newState 
 * @returns a ServiceResponse. If the update is not correct due to domain restrictions the message is CHANGE_STATE_NOT_VALID and the data undefined.
 * It checks with the repository if the order exists, if not returns the repository response. Otherwise it updates the order through the repository and returns
 * the repository response.
 */
export async function updateOrder(orderId: string, newState: OrderState): Promise<ServiceResponse<Order>> {
	let order = await repository.findOrderById(orderId)
	if (order.message == OrdersMessage.OK && order.data) {

		if (!isChangeStateValid(order.data.type, order.data.state, newState)) {
			return { data: undefined, message: OrdersMessage.CHANGE_STATE_NOT_VALID }
		}

		return await repository.updateOrder(orderId, newState)


	} else {
		return { data: order.data, message: order.message }
	}

}

function isChangeStateValid(orderType: OrderType, currentState: OrderState, newState: OrderState): boolean {
	switch (newState) {
		case OrderState.PENDING: {
			return false
		}
		case OrderState.COMPLETED: {
			return (orderType == OrderType.AT_THE_TABLE && currentState == OrderState.PENDING) || (orderType != OrderType.AT_THE_TABLE && currentState == OrderState.READY)

		}
		case OrderState.READY: {
			return orderType != OrderType.AT_THE_TABLE && currentState == OrderState.PENDING
		}
	}
}
