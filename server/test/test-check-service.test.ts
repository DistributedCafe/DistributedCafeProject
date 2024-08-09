import { Service } from '../src/utils/service'
import { RequestMessage, ResponseMessage, WarehouseServiceMessages } from '../src/utils/messages';
import { check_service } from '../src/check-service';

import express from 'express';
import { IncomingMessage, Server, ServerResponse, createServer } from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { add, cleanCollection, closeMongoClient, DbCollections, DbNames, getCollection } from './utils/db-connection';
import { check_order_message, coffee, createRequestMessage, createResponseMessage, milk, tea } from './utils/test-utils';
import { ERROR_INGREDIENT_ALREADY_EXISTS, ERROR_INGREDIENT_NOT_FOUND, ERROR_INGREDIENT_QUANTITY, OK } from './utils/api-response';

// milk 95, tea 0
let m: ResponseMessage
let ws: WebSocket;
let wss: WebSocketServer;
const app = express();
let server: Server<typeof IncomingMessage, typeof ServerResponse>
let qty = 10

beforeAll(async () => {
	await (await getCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE)).createIndex({ name: 1 }, { unique: true })
})

afterEach(() => {
	ws.close()
	server.close()
})
beforeEach(async () => {
	await cleanCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE)
	await add(DbNames.WAREHOUSE, DbCollections.WAREHOUSE, JSON.stringify(milk))
	await add(DbNames.WAREHOUSE, DbCollections.WAREHOUSE, JSON.stringify(tea))
	server = createServer(app);
	wss = new WebSocketServer({ server });
})

afterAll(() => { closeMongoClient() })

const testCheckService = (action: string, input: any, expectedResponse: ResponseMessage, callback: jest.DoneCallback) => {
	createConnectionAndCall(createRequestMessage(Service.WAREHOUSE, action, input), expectedResponse, callback)
}

// read
test('Get all Ingredient Test - 200', done => {
	testCheckService(WarehouseServiceMessages.GET_ALL_INGREDIENT, '',
		createResponseMessage(OK, [milk, tea]), done)
});

test('Get all Available Ingredient Test - 200', done => {
	testCheckService(WarehouseServiceMessages.GET_ALL_AVAILABLE_INGREDIENT, '',
		createResponseMessage(OK, [milk]), done)
});

// write
test('Restock Test - 200', done => {
	let input = JSON.stringify({ name: "milk", quantity: qty })
	let output = { name: "milk", quantity: (milk.quantity + qty) }

	testCheckService(WarehouseServiceMessages.RESTOCK_INGREDIENT, input,
		createResponseMessage(OK, output), done)
});

test('Restock Test - 400', done => {
	let input = JSON.stringify({ name: "coffee", quantity: qty })
	testCheckService(WarehouseServiceMessages.RESTOCK_INGREDIENT, input,
		createResponseMessage(ERROR_INGREDIENT_NOT_FOUND, ""), done)
});

test('Create Ingredient Test - 400', done => {
	testCheckService(WarehouseServiceMessages.CREATE_INGREDIENT, milk,
		createResponseMessage(ERROR_INGREDIENT_ALREADY_EXISTS, ""), done)
});

test('Create Ingredient Test - 200', done => {
	testCheckService(WarehouseServiceMessages.CREATE_INGREDIENT, coffee,
		createResponseMessage(OK, coffee), done)
});

test('Decrease Ingredients Quantity Test - 400', done => {
	let input = JSON.stringify([{ name: "milk", quantity: (milk.quantity + qty) }])
	testCheckService(WarehouseServiceMessages.DECREASE_INGREDIENTS_QUANTITY, input,
		createResponseMessage(ERROR_INGREDIENT_QUANTITY, ""), done)
});

test('Decrease Ingredients Quantity Test - 200', done => {
	let input = JSON.stringify([{ name: "milk", quantity: qty }])
	let output = [{ name: "milk", quantity: (milk.quantity - qty) }, { name: "tea", quantity: 0 }]
	testCheckService(WarehouseServiceMessages.DECREASE_INGREDIENTS_QUANTITY, input,
		createResponseMessage(OK, output), done)
});


function createConnectionAndCall(requestMessage: RequestMessage, expectedResponse: ResponseMessage, callback: jest.DoneCallback) {
	wss.on('connection', (ws) => {
		ws.on('error', console.error);

		ws.on('message', (msg: string) => {
			check_order_message(JSON.parse(msg), expectedResponse)
			callback()
		});

	});
	server.listen(8081, () => console.log('listening on port :8081'));

	ws = new WebSocket('ws://localhost:8081');
	ws.on('open', () => {
		const managerWs = Array()
		check_service(requestMessage, ws, managerWs)
	})
}
