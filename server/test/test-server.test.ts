import WebSocket from 'ws'
import { Service } from '../src/utils/service'
import { RequestMessage, ResponseMessage, WarehouseServiceMessages } from '../src/utils/messages'
import { add, cleanCollection, closeMongoClient, DbCollections, DbNames, getCollection } from './utils/db-connection'
import { check_order_message, coffee, createRequestMessage, createResponseMessage, milk, tea } from './utils/test-utils'
import { ERROR_INGREDIENT_ALREADY_EXISTS, ERROR_INGREDIENT_NOT_FOUND, ERROR_INGREDIENT_QUANTITY, OK } from './utils/api-response'

// milk 95, tea 0

let m: ResponseMessage
let ws: WebSocket
let qty = 10

beforeAll(async () => {
	await (await getCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE)).createIndex({ name: 1 }, { unique: true })
})

beforeEach(async () => {
	await cleanCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE)
	await add(DbNames.WAREHOUSE, DbCollections.WAREHOUSE, JSON.stringify(milk))
	await add(DbNames.WAREHOUSE, DbCollections.WAREHOUSE, JSON.stringify(tea))
})

afterEach(() => { ws.close() })

afterAll(() => { closeMongoClient() })


const testApi = (action: string, input: any, expectedResponse: ResponseMessage, callback: jest.DoneCallback) => {
	startWebsocket(createRequestMessage(Service.WAREHOUSE, action, input), expectedResponse, callback)
}

// read
test('Get all Ingredient Test - 200', done => {
	testApi(WarehouseServiceMessages.GET_ALL_INGREDIENT, '',
		createResponseMessage(OK, [milk, tea]), done)
})

test('Get all Available Ingredient Test - 200', done => {
	testApi(WarehouseServiceMessages.GET_ALL_AVAILABLE_INGREDIENT, '',
		createResponseMessage(OK, [milk]), done)
})

// write
test('Restock Test - 200', done => {
	let input = JSON.stringify({ name: "milk", quantity: qty })
	let output = { name: "milk", quantity: (milk.quantity + qty) }
	testApi(WarehouseServiceMessages.RESTOCK_INGREDIENT, input,
		createResponseMessage(OK, output), done)
})

test('Restock Test - 400', done => {
	let input = JSON.stringify({ name: "coffee", quantity: qty })
	testApi(WarehouseServiceMessages.RESTOCK_INGREDIENT, input,
		createResponseMessage(ERROR_INGREDIENT_NOT_FOUND, ""), done)
})

test('Create Ingredient Test - 400', done => {
	testApi(WarehouseServiceMessages.CREATE_INGREDIENT, milk,
		createResponseMessage(ERROR_INGREDIENT_ALREADY_EXISTS, ""), done)
})

test('Create Ingredient Test - 200', done => {
	testApi(WarehouseServiceMessages.CREATE_INGREDIENT, coffee,
		createResponseMessage(OK, coffee), done)
})

test('Decrease Ingredients Quantity Test - 400', done => {
	let input = JSON.stringify([{ name: "milk", quantity: (milk.quantity + qty) }])
	testApi(WarehouseServiceMessages.DECREASE_INGREDIENTS_QUANTITY, input,
		createResponseMessage(ERROR_INGREDIENT_QUANTITY, ""), done)
})

test('Decrease Ingredients Quantity Test - 200', done => {
	let input = JSON.stringify([{ name: "milk", quantity: qty }])
	let output = [{ name: "milk", quantity: (milk.quantity - qty) }, { name: "tea", quantity: 0 }]
	testApi(WarehouseServiceMessages.DECREASE_INGREDIENTS_QUANTITY, input,
		createResponseMessage(OK, output), done)
})

function startWebsocket(requestMessage: RequestMessage, expectedResponse: ResponseMessage, callback: jest.DoneCallback) {
	ws = new WebSocket('ws://localhost:3000')

	ws.on('message', (msg: string) => {
		check_order_message(JSON.parse(msg), expectedResponse)
		callback()
	})

	ws.on('open', () => {
		ws.send(JSON.stringify(requestMessage))
	})
}
