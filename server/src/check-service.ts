import { OrdersServiceMessages, RequestMessage, ResponseMessage, WarehouseServiceMessages } from './utils/messages'
import { Service } from './utils/service';
import axios from 'axios';

const http = axios.create({
	baseURL: 'http://localhost:8080'
})
const httpOrders = axios.create({
	baseURL: 'http://localhost:8090'
})
/**
 * This function is used to call the correct microservice and API based on the received RequestMessage. 
 * It also sends the answer back through the websocket
	  @param message sent by the client through the websocket
	@param ws the websocket communication used
**/
export function check_service(message: RequestMessage, ws: any) {
	console.log('received: %s', message);
	switch (message.client_name) {
		case Service.WAREHOUSE:
			warehouse_api(message.client_request, message.input, ws)
			break;
		case Service.MENU:
			// TODO
			break;
		default:
			orders_api(message.client_request, message.input, ws)
			break;
	}
}

function orders_api(message: string, input: string, ws: WebSocket) {
	switch (message) {
		case OrdersServiceMessages.CREATE_ORDER.toString():
			handleResponse(httpOrders.post('/orders/', input), ws)
			break;
		default: //get all orders
			handleResponse(httpOrders.get('/orders/'), ws)
			break;
	}
}

function warehouse_api(message: string, input: string, ws: WebSocket) {
	switch (message) {
		case WarehouseServiceMessages.CREATE_INGREDIENT.toString():
			handleResponse(http.post('/warehouse/', input), ws)
			break;
		case WarehouseServiceMessages.DECREASE_INGREDIENTS_QUANTITY.toString():
			handleResponse(http.put('/warehouse/', input), ws)
			break;
		case WarehouseServiceMessages.GET_ALL_AVAILABLE_INGREDIENT.toString():
			handleResponse(http.get('/warehouse/available'), ws)
			break;
		case WarehouseServiceMessages.GET_ALL_INGREDIENT.toString():
			handleResponse(http.get('/warehouse/'), ws)
			break;
		default: //restock
			const body = JSON.parse(input)
			const quantity = {
				"quantity": body.quantity
			}
			handleResponse(http.put('/warehouse/' + body.name, quantity), ws)
			break;
	}
}

function handleResponse(promise: Promise<any>, ws: WebSocket) {
	promise.then((res) => {
		const msg: ResponseMessage = {
			message: res.statusText,
			code: res.status,
			data: JSON.stringify(res.data)
		}
		ws.send(JSON.stringify(msg))
	}).catch((error) => {
		var msg: ResponseMessage
		if (error.response == undefined) {
			msg = {
				message: "ERROR_SERVER_NOT_AVAILABLE",
				code: 500,
				data: ""
			}
		} else {
			msg = {
				message: error.response.statusText,
				code: error.response.status,
				data: ""
			}
		}
		ws.send(JSON.stringify(msg))
	});
}
