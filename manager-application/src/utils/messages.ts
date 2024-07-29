import { Service } from './service';

/**
 * This interface represents the request the client sends to the server
 */
export interface RequestMessage {
	client_name: Service
	client_request: string
	input: string
}

/**
 * This interface represents the response the client receives from the server
 */
export interface ResponseMessage {
	message: string,
	code: number,
	data: string
}

/**
 * Different messages handled by the warehouse microservice
 */
export const WarehouseServiceMessages = {
	CREATE_INGREDIENT: 'CREATE_INGREDIENT',
	GET_ALL_INGREDIENT: 'GET_ALL_INGREDIENT',
	DECREASE_INGREDIENTS_QUANTITY: 'DECREASE_INGREDIENTS_QUANTITY',
	GET_ALL_AVAILABLE_INGREDIENT: 'GET_ALL_AVAILABLE_INGREDIENT',
	RESTOCK_INGREDIENT: 'RESTOCK_INGREDIENT'
}
Object.freeze(WarehouseServiceMessages)
