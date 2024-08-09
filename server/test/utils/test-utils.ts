import { OrdersServiceMessages, ResponseMessage } from "../../src/utils/messages";
import { Service } from "../../src/utils/service";
import { ApiResponse } from "./api-response";
import { DbCollections, DbNames, getCollection } from "./db-connection";
import { addIdandState } from "./order-json-utils";
import { WebSocket } from 'ws';

const orderItemQuantity = 2

export const newOrderOmelette = {
	"customerEmail": "c2@example.com",
	"price": 1,
	"type": "TAKE_AWAY",
	"items": [
		{
			"item": {
				"name": "omelette"
			},
			"quantity": orderItemQuantity
		},
	]
}

export const milk = {
	name: "milk",
	quantity: 95
}

export const tea = {
	name: "tea",
	quantity: 0
}

export const omelette = {
	name: "omelette",
	recipe: [
		{
			ingredient_name: "egg",
			quantity: 2
		}
	],
	price: 3
}

export const blackCoffee = {
	name: "black_coffee",
	recipe: [
		{
			ingredient_name: "coffee",
			quantity: 1
		}
	],
	price: 1
}

export const boiledEgg = {
	name: "boiled_egg",
	recipe: [
		{
			ingredient_name: "egg",
			quantity: 1
		}
	],
	price: 1
}
export const friedEgg = {
	name: "fried_egg",
	recipe: [
		{
			ingredient_name: "egg",
			quantity: 1
		}
	],
	price: 1
}

export const order: any = {
	"customerEmail": "c1@example.com",
	"price": 1,
	"type": "HOME_DELIVERY",
	"state": "PENDING",
	"items": [
		{
			"item": {
				"name": "i1"
			},
			"quantity": 2
		},
	]
}

export const newWrongOrder = {
	"customerEmail": "c1@example.com",
	"price": "1",
	"type": "HOME_DELIVERY",
	"items": [
		{
			"item": {
				"name": "omelette"
			},
			"quantity": 2
		},
	]
}

export const egg = {
	"name": "egg",
	"quantity": 4
}


export const coffee = {
	"name": "coffee",
	"quantity": 20
}

/**
 * Check that the response message is correct
 * @param msg that has to be checked
 * @param expectedResponse correct response
 * @param request request of the client (if needed)
 */
export async function check_order_message(msg: ResponseMessage, expectedResponse: ResponseMessage, request?: string) {
	console.log("MESSAGE: " + msg.message)
	const expectedData = expectedResponse.data
	expect(msg.code).toBe(expectedResponse.code);
	expect(msg.message).toBe(expectedResponse.message);
	if (msg.code == 200) {
		if (request == OrdersServiceMessages.CREATE_ORDER) {
			expect(JSON.parse(msg.data)).toStrictEqual(await addIdandState(expectedData));
			//check ingredient db
			let dbEgg = await (await getCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE)).findOne({ name: "egg" }, { projection: { _id: 0 } })
			const qty = egg.quantity - (omelette.recipe[0].quantity * orderItemQuantity)
			expect(dbEgg?.quantity).toBe(qty)
		} else {
			expect(JSON.parse(msg.data)).toStrictEqual(expectedData);
		}
	} else {
		expect(msg.data).toBe("")
	}
}

/**
 * Create a request message
 * @param client that represent the microservice
 * @param request of the client
 * @param input body of the request
 * @returns a request message
 */
export function createRequestMessage(client: Service, request: string, input: any) {
	return {
		client_name: client,
		client_request: request,
		input: input
	}
}

/**
 * Create a response message
 * @param code
 * @param msg 
 * @param data 
 * @returns a response message
 */
export function createResponseMessage(response: ApiResponse, data: any): ResponseMessage {
	return {
		code: response.code,
		message: response.message,
		data: data
	}
}

/**
 * Check if a web socket is open and closes it if it is
 * @param ws web socket that have to be close
 */
export function closeWsIfOpened(ws: WebSocket) {
	if (ws?.OPEN) {
		ws.close()
	}
}

export const OrderStates = {
	PENDING: "PENDING",
	READY: "READY",
	COMPLETED: "COMPLETED"
}
