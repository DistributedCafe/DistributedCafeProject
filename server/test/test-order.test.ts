import { WebSocket, WebSocketServer } from 'ws';
import { Service } from '../src/utils/service'
import { OrdersServiceMessages, RequestMessage, ResponseMessage } from '../src/utils/messages';
import { add, cleanCollection, closeMongoClient, DbCollections, DbNames, getCollection } from './utils/db-connection';
import { blackCoffee, check_order_message, closeWsIfOpened, coffee, createRequestMessage, createResponseMessage, egg, newOrderOmelette, newWrongOrder, omelette, order, OrderStates } from './utils/test-utils';
import { addId, addIdandState } from './utils/order-json-utils';
import express from "express"
import { IncomingMessage, Server, ServerResponse, createServer } from 'http';
import { check_service } from '../src/check-service'
import { ApiResponse, CHANGE_STATE_NOT_VALID, ERROR_MISSING_INGREDIENTS, ERROR_WRONG_PARAMETERS, OK, ORDER_ID_NOT_FOUND } from './utils/api-response';

let ws_route: WebSocket
let ws_check_service: WebSocket
let wsManager: WebSocket
let wss: WebSocketServer
let server: Server<typeof IncomingMessage, typeof ServerResponse>
let insertedId: string
const app = express()
const managerWsMsg = "Manager frontend web socket"
const orderWsMsg = "New order web socket"

beforeAll(async () => {
	await cleanCollection(DbNames.MENU, DbCollections.MENU)
	await (await getCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE)).createIndex({ name: 1 }, { unique: true })
	await (await getCollection(DbNames.MENU, DbCollections.MENU)).createIndex({ name: 1 }, { unique: true })
	await add(DbNames.MENU, DbCollections.MENU, JSON.stringify(omelette))
})


beforeEach(async () => {
	await cleanCollection(DbNames.ORDERS, DbCollections.ORDERS)
	await cleanCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE)
	await getCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE)
	await add(DbNames.WAREHOUSE, DbCollections.WAREHOUSE, JSON.stringify(egg))
	insertedId = (await add(DbNames.ORDERS, DbCollections.ORDERS, JSON.stringify(order))).insertedId.toString()
	server = createServer(app)
	wss = new WebSocketServer({ server })
})

afterEach(() => {
	closeWsIfOpened(ws_check_service)
	closeWsIfOpened(ws_route)
	closeWsIfOpened(wsManager)
	server.close()
})

afterAll(() => { closeMongoClient() })

const testCheckService = (action: string, input: any, expectedResponse: ResponseMessage, callback: jest.DoneCallback) => {
	createConnectionAndCall(createRequestMessage(Service.ORDERS, action, input), expectedResponse, callback)
}

function testApi(action: string, input: any, expectedResponse: ResponseMessage, callback: jest.DoneCallback) {
	startWebsocket(createRequestMessage(Service.ORDERS, action, input),
		expectedResponse, callback)
}
//read
test('Get all orders - 200', done => {
	testApi(OrdersServiceMessages.GET_ALL_ORDERS, '', createResponseMessage(OK, [addId(order, insertedId)]), done)
})

test('Get all orders - 200 (check-service)', done => {
	testCheckService(OrdersServiceMessages.GET_ALL_ORDERS, "",
		createResponseMessage(OK, [addId(order, insertedId)]), done)
})

test('Get order by id - 200', done => {
	testApi(OrdersServiceMessages.GET_ORDER_BY_ID, insertedId, createResponseMessage(OK, addId(order, insertedId)), done)
})

test('Get order by id - 200 (check-service)', done => {
	testCheckService(OrdersServiceMessages.GET_ORDER_BY_ID, insertedId,
		createResponseMessage(OK, addId(order, insertedId)), done)
})

test('Get order by id - 404 (check-service)', done => {
	testCheckService(OrdersServiceMessages.GET_ORDER_BY_ID, "1",
		createResponseMessage(ORDER_ID_NOT_FOUND, undefined), done)
})

//write
test('Create Order Test - 200', done => {
	testApi(OrdersServiceMessages.CREATE_ORDER, newOrderOmelette, createResponseMessage(OK, newOrderOmelette), done)
})

test('Create Order Test (check-service) - 200 and missing ingredient notification', done => {
	createConnectionAndCallNewOrder(createRequestMessage(Service.ORDERS, OrdersServiceMessages.CREATE_ORDER, newOrderOmelette),
		createResponseMessage(OK, newOrderOmelette), done)
})

test('Create Order Test (check-service) - 200', done => {
	add(DbNames.WAREHOUSE, DbCollections.WAREHOUSE, JSON.stringify(coffee)).then(() => {
		add(DbNames.MENU, DbCollections.MENU, JSON.stringify(blackCoffee)).then(() => {
			testCheckService(OrdersServiceMessages.CREATE_ORDER, newOrderOmelette,
				createResponseMessage(OK, newOrderOmelette), done)
		})
	})
})

test('Create Order Test (check-service) - 400 - Missing Ingredients', done => {
	cleanCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE).then(() => {
		testCheckService(OrdersServiceMessages.CREATE_ORDER, newOrderOmelette,
			createResponseMessage(ERROR_MISSING_INGREDIENTS, ""), done)
	})
})

test('Create Order Test - 400 - Wrong parameters', done => {
	testApi(OrdersServiceMessages.CREATE_ORDER, newWrongOrder, createResponseMessage(ERROR_WRONG_PARAMETERS, ""), done)

})

test('Create Order Test - 400 - Wrong parameters (check-service)', done => {
	testCheckService(OrdersServiceMessages.CREATE_ORDER, newWrongOrder,
		createResponseMessage(ERROR_WRONG_PARAMETERS, ""), done)
})

test('Put Order Test - 200', done => {
	testPutOrder(OrderStates.PENDING, OrderStates.READY, OK, testApi, done)
})

function testPutOrder(initState: string, finalState: string, apiResponse: ApiResponse, test: (action: string, input: any, expectedResponse: ResponseMessage, callback: jest.DoneCallback) => void, callback: jest.DoneCallback) {
	cleanCollection(DbNames.ORDERS, DbCollections.ORDERS).then(() => {
		let newOrder = { ...order }
		newOrder["state"] = initState
		add(DbNames.ORDERS, DbCollections.ORDERS, JSON.stringify(newOrder)).then((res) => {
			let id = res.insertedId.toString()
			let update = {
				"_id": id,
				"state": finalState
			}
			let expectedData
			if (apiResponse.code == 200) {
				newOrder["_id"] = id
				newOrder["state"] = finalState
				expectedData = [newOrder]
			} else {
				expectedData = undefined
			}
			test(OrdersServiceMessages.PUT_ORDER, JSON.stringify(update),
				createResponseMessage(apiResponse, expectedData), callback)
		})
	})
}

test('Put Order Test - 200 (check-service)', done => {
	testPutOrder(OrderStates.READY, OrderStates.COMPLETED, OK, testCheckService, done)
})

test('Put Order Test - 400 (check-service)', done => {
	testPutOrder(OrderStates.COMPLETED, OrderStates.PENDING, CHANGE_STATE_NOT_VALID, testCheckService, done)
})

test('Put Order Test - 404 (check-service) - id not found', done => {
	cleanCollection(DbNames.ORDERS, DbCollections.ORDERS).then(() => {
		let update = {
			"_id": "1",
			"state": OrderStates.PENDING
		}

		testCheckService(OrdersServiceMessages.PUT_ORDER, JSON.stringify(update),
			createResponseMessage(ORDER_ID_NOT_FOUND, undefined), done)
	})
})

function onMessage(ws: WebSocket, expectedResponse: ResponseMessage, request: string, callback: jest.DoneCallback) {
	ws.on('message', async (msg: string) => {
		await check_order_message(JSON.parse(msg), expectedResponse, request)
		callback()
	});
}

function startWebsocket(requestMessage: RequestMessage, expectedResponse: ResponseMessage, callback: jest.DoneCallback) {
	ws_route = new WebSocket('ws://localhost:3000');
	onMessage(ws_route, expectedResponse, requestMessage.client_request, callback)

	ws_route.on('open', () => {
		ws_route.send(JSON.stringify(requestMessage))
	});
}

function createConnectionAndCall(requestMessage: RequestMessage, expectedResponse: ResponseMessage, callback: jest.DoneCallback) {
	wss.on('connection', (ws) => {
		ws.on('error', console.error);
		onMessage(ws, expectedResponse, requestMessage.client_request, callback)
	});
	server.listen(8081, () => console.log('listening on port :8081'));

	ws_check_service = new WebSocket('ws://localhost:8081');
	ws_check_service.on('open', () => {
		const managerWsArray = Array()
		check_service(requestMessage, ws_check_service, managerWsArray)
	})
}

interface IArray {
	[index: string]: WebSocket;
}

function createConnectionAndCallNewOrder(requestMessage: RequestMessage, expectedResponse: ResponseMessage, callback: jest.DoneCallback) {
	let connections: Map<WebSocket, string> = new Map()
	let wsArray = {} as IArray

	wss.on('connection', (ws: WebSocket) => {
		ws.on('error', console.error);

		ws.on('message', async (msg: string) => {
			if (msg == managerWsMsg) {
				wsArray[managerWsMsg] = ws
			} else if (msg == orderWsMsg) {
				wsArray[orderWsMsg] = ws
			} else {
				connections.set(ws, msg)
				if (connections.size == 2) {
					const orederRes = JSON.parse(connections.get(wsArray[orderWsMsg])!)
					const managerRes = JSON.parse(connections.get(wsArray[managerWsMsg])!)

					expect(wsArray[managerWsMsg]).toBe(ws)
					expect(wsArray[orderWsMsg] == ws).toBeFalsy

					// server
					expectedResponse.data = await addIdandState(expectedResponse.data)
					check_order_message(orederRes, expectedResponse, OrdersServiceMessages.CREATE_ORDER)
					expect(managerRes.message).toBe("NEW_MISSING_INGREDIENTS")
					expect(JSON.parse(managerRes.data)).toStrictEqual([egg])
					callback()
				}
			}
		});
	});
	server.listen(8081, () => console.log('listening on port :8081'));

	ws_check_service = new WebSocket('ws://localhost:8081');
	ws_check_service.on('open', () => {
		let managerWsArray = Array()
		managerWsArray.push(wsManager)
		check_service(requestMessage, ws_check_service, managerWsArray)
		ws_check_service.send(orderWsMsg)
	})

	wsManager = new WebSocket('ws://localhost:8081')
	wsManager.on('open', () => {
		wsManager.send(managerWsMsg)
	})
}
