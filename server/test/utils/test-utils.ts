import { OrdersServiceMessages, ResponseMessage } from "../../src/utils/messages";
import { Service } from "../../src/utils/service";
import { addIdandState } from "./json-utils";

export const order: any = {
	"customerContact": "c1",
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

export const newOrder = {
	"customerContact": "c1",
	"price": 1,
	"type": "HOME_DELIVERY",
	"items": [
		{
			"item": {
				"name": "i1"
			},
			"quantity": 2
		},
	]
}

/**
 * Check that the responce message is correct
 * @param msg that has to be checked
 * @param code correct code
 * @param message correct message
 * @param data correct data. Id and state are added to data if the request was to create a new order
 * @param request request of the client
 */
export async function check_order_message(msg: ResponseMessage, code: number, message: string, data: any, request: string) {
	expect(msg.code).toBe(code);
	expect(msg.message).toBe(message);
	if (request == OrdersServiceMessages.CREATE_ORDER.toString()) {
		expect(JSON.parse(msg.data)).toStrictEqual(JSON.parse(await addIdandState(data)));
	} else {
		expect(JSON.parse(msg.data)).toStrictEqual(JSON.parse(data));
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
