import WebSocket, { WebSocketServer } from 'ws';
import { Service } from '../src/utils/service'
import { OrdersServiceMessages, RequestMessage } from '../src/utils/messages';
import { add, cleanCollection, closeMongoClient, getCollection } from './utils/db-connection';
import { check_order_message, createRequestMessage, egg, newWrongOrder, omelette, order, orderItemQuantity } from './utils/test-utils';
import { addId } from './utils/order-json-utils';
import express from "express"
import { IncomingMessage, Server, ServerResponse, createServer } from 'http';
import { check_service } from '../src/check-service';

let ws_route: WebSocket
let ws_check_service: WebSocket;
let wss: WebSocketServer;
let server: Server<typeof IncomingMessage, typeof ServerResponse>
let insertedId: string
const app = express();

beforeAll(async () => {
	await cleanCollection("Orders", "Orders")
	await cleanCollection("Menu", "Items")
	await cleanCollection("Warehouse", "Ingredient")
	let warehouse = await getCollection("Warehouse", "Ingredient")
	await warehouse.createIndex({ name: 1 }, { unique: true })
	let menu = await getCollection("Menu", "Items")
	await menu.createIndex({ name: 1 }, { unique: true })
	let res = await add("Orders", "Orders", JSON.stringify(order))
	insertedId = res.insertedId.toString()
	await add("Menu", "Items", JSON.stringify(omelette))
})

beforeEach(async () => {
	await cleanCollection("Warehouse", "Ingredient")
	await getCollection("Warehouse", "Ingredient")
	await add("Warehouse", "Ingredient", JSON.stringify(egg))
	server = createServer(app);
	wss = new WebSocketServer({ server });
})

afterEach(() => {
	if (ws_check_service?.OPEN) {
		ws_check_service.close()
	}
	if (ws_route?.OPEN) {
		ws_route.close()
	}
	server.close()
})

afterAll(() => { closeMongoClient() })

//read
test('Get all orders - 200', done => {
	let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.GET_ALL_ORDERS.toString(), '')
	startWebsocket(requestMessage, 200, "OK", addId(order, insertedId), done)
});

test('Get all orders - 200 (check-service)', done => {
	let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.GET_ALL_ORDERS.toString(), '')
	createConnectionAndCall(requestMessage, 200, "OK", addId(order, insertedId), done)
})

test('Get order by id - 200', done => {
	let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.GET_ORDER_BY_ID.toString(), insertedId)
	let expected = JSON.stringify(JSON.parse(addId(order, insertedId))[0])
	startWebsocket(requestMessage, 200, "OK", expected, done)
})

test('Get order by id - 200 (check-service)', done => {
	let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.GET_ORDER_BY_ID.toString(), insertedId)
	let expected = JSON.stringify(JSON.parse(addId(order, insertedId))[0])
	createConnectionAndCall(requestMessage, 200, "OK", expected, done)
})

test('Get order by id - 404 (check-service)', done => {
	let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.GET_ORDER_BY_ID.toString(), "1")
	createConnectionAndCall(requestMessage, 404, "ORDER_ID_NOT_FOUND", undefined, done)
})

//write
test('Create Order Test - 200', done => {
	const newOrder = {
		"customerContact": "c1@example.com",
		"price": 1,
		"type": "HOME_DELIVERY",
		"items": [
			{
				"item": {
					"name": "omelette"
				},
				"quantity": orderItemQuantity
			},
		]
	}
	startWebsocket(
		createRequestMessage(Service.ORDERS, OrdersServiceMessages.CREATE_ORDER.toString(), newOrder), 200, "OK", newOrder, done)
});

test('Create Order Test (check-service) - 200', done => {
	const newOrder = {
		"customerContact": "c2",
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
	createConnectionAndCall(
		createRequestMessage(Service.ORDERS, OrdersServiceMessages.CREATE_ORDER.toString(), newOrder), 200, "OK", newOrder, done)
});

test('Create Order Test - 400', done => {
	let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.CREATE_ORDER.toString(), newWrongOrder)
	startWebsocket(requestMessage, 400, "ERROR_WRONG_PARAMETERS", "", done)

});

test('Create Order Test - 400 (check-service)', done => {
	let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.CREATE_ORDER.toString(), newWrongOrder)
	createConnectionAndCall(requestMessage, 400, "ERROR_WRONG_PARAMETERS", "", done)
})

test('Put Order Test - 200', done => {
	add("Orders", "Orders", JSON.stringify(order)).then((res) => {
		let id = res.insertedId.toString()
		let modOrder = { ...order }
		modOrder["_id"] = id
		modOrder["state"] = "READY"
		let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.PUT_ORDER.toString(), modOrder)
		startWebsocket(requestMessage, 200, "OK", JSON.stringify(modOrder), done)
	})

})

test('Put Order Test - 200 (check-service)', done => {
	let modOrder = { ...order }
	modOrder["state"] = "READY"
	add("Orders", "Orders", JSON.stringify(modOrder)).then((res) => {
		let id = res.insertedId.toString()
		modOrder["_id"] = id
		modOrder["state"] = "COMPLETED"
		let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.PUT_ORDER.toString(), modOrder)
		createConnectionAndCall(requestMessage, 200, "OK", JSON.stringify(modOrder), done)
	})

})

test('Put Order Test - 400 (check-service)', done => {
	let modOrder = { ...order }
	modOrder["state"] = "COMPLETED"
	add("Orders", "Orders", JSON.stringify(modOrder)).then((res) => {
		let id = res.insertedId.toString()
		modOrder["_id"] = id
		modOrder["state"] = "PENDING"
		let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.PUT_ORDER.toString(), modOrder)
		createConnectionAndCall(requestMessage, 400, "CHANGE_STATE_NOT_VALID", undefined, done)
	})

})

function startWebsocket(requestMessage: RequestMessage, code: number, message: string, data: any, callback: jest.DoneCallback) {
	ws_route = new WebSocket('ws://localhost:3000');
	ws_route.on('message', async (msg: string) => {
		await check_order_message(JSON.parse(msg), code, message, data, requestMessage.client_request)
		callback()
	});

	ws_route.on('open', () => {
		ws_route.send(JSON.stringify(requestMessage))
	});
}

function createConnectionAndCall(requestMessage: RequestMessage, code: number, message: string, data: any, callback: jest.DoneCallback) {
	wss.on('connection', (ws) => {
		ws.on('error', console.error);

		ws.on('message', async (msg: string) => {
			await check_order_message(JSON.parse(msg), code, message, data, requestMessage.client_request)
			callback()
		});

	});
	server.listen(8081, () => console.log('listening on port :8081'));

	ws_check_service = new WebSocket('ws://localhost:8081');
	ws_check_service.on('open', () => {
		check_service(requestMessage, ws_check_service)
	})
}
