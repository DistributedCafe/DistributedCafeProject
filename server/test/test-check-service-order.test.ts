import { Service } from '../src/utils/service'
import { OrdersServiceMessages, RequestMessage, ResponseMessage } from '../src/utils/messages';
import { check_service } from '../src/check-service';
import express from 'express';
import { IncomingMessage, Server, ServerResponse, createServer } from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { addOrder, cleanCollection, closeMongoClient } from './utils/orders-db-connection';
import { addId } from './utils/json-utils';
import { check_order_message, createRequestMessage, newOrder, order } from './utils/test-utils';

let m: ResponseMessage
let ws: WebSocket;
let wss: WebSocketServer;
const app = express();
let server: Server<typeof IncomingMessage, typeof ServerResponse>
let insertedId: string

beforeAll(async () => {
	cleanCollection()
	let res = await addOrder(JSON.stringify(order))
	insertedId = res.insertedId.toString()
})

afterEach(() => {
	ws.close()
	server.close()
})
beforeEach(() => {
	server = createServer(app);
	wss = new WebSocketServer({ server });
})

afterAll(() => { closeMongoClient() })

// read
test('Get all Ingredient Test - 200', done => {
	const requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.GET_ALL_ORDERS.toString(), '')
	createConnectionAndCall(requestMessage, addId(order, insertedId), done)
});


// write
test('Create Ingredient Test - 200', done => {
	let requestMessage = createRequestMessage(Service.ORDERS, OrdersServiceMessages.CREATE_ORDER.toString(), newOrder)
	createConnectionAndCall(requestMessage, newOrder, done)

});

function createConnectionAndCall(requestMessage: RequestMessage, data: any, callback: jest.DoneCallback) {
	wss.on('connection', (ws) => {
		ws.on('error', console.error);

		ws.on('message', async (msg: string) => {
			await check_order_message(JSON.parse(msg), 200, 'OK', data, requestMessage.client_request)
			callback()
		});

	});
	server.listen(8081, () => console.log('listening on port :8081'));

	ws = new WebSocket('ws://localhost:8081');
	ws.on('open', () => {
		check_service(requestMessage, ws)
	})
}
