import WebSocket from 'ws';
import { Service } from '../src/utils/service'
import { OrdersServiceMessages, RequestMessage, ResponseMessage } from '../src/utils/messages';
import { addOrder, cleanCollection, closeMongoClient } from './utils/orders-db-connection';
import { addId } from './utils/json-utils';
import { check_order_message, createRequestMessage, newOrder, order } from './utils/test-utils';

let m: ResponseMessage
let ws: WebSocket
let insertedId: string

beforeAll(async () => { 
    cleanCollection()
    let res = await addOrder(JSON.stringify(order)) 
    insertedId = res.insertedId.toString()
})

afterEach(() => { ws.close() })

afterAll(() => { closeMongoClient() })

//read
test('Get all orders - 200', done => {
	let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.GET_ALL_ORDERS.toString(), '')
	startWebsocket(requestMessage, addId(order, insertedId), done)
});

//write
test('Create Ingredient Test - 200', done => {
	let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.CREATE_ORDER.toString(), newOrder)
	startWebsocket(requestMessage, newOrder, done)
});

function startWebsocket(requestMessage: RequestMessage, data: any, callback: jest.DoneCallback) {
	ws = new WebSocket('ws://localhost:3000');
	ws.on('message', async (msg: string) => {
		await check_order_message(JSON.parse(msg), 200, 'OK', data, requestMessage.client_request)
		callback()

	});

	ws.on('open', () => {
		ws.send(JSON.stringify(requestMessage))
	});
}