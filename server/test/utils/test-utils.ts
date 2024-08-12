import { createServer, IncomingMessage, Server, ServerResponse } from "http"
import { OrdersServiceMessages, RequestMessage, ResponseMessage } from "../../src/utils/messages"
import { Service } from "../../src/utils/service"
import { ApiResponse } from "./api-response"
import { DbCollections, DbNames, getCollection } from "./db-connection"
import { addIdandState } from "./order-json-utils"
import { WebSocket, WebSocketServer } from 'ws'
import { check_service } from "../../src/check-service"
import express from "express"
import { egg, omelette, orderItemQuantity } from "./test-data"

const app = express()
export let ws_route: WebSocket
export let ws_check_service: WebSocket
export let wss: WebSocketServer
export let server: Server<typeof IncomingMessage, typeof ServerResponse>

export function initializeServer() {
	server = createServer(app)
	wss = new WebSocketServer({ server })
}

export function closeWs() {
	closeWsIfOpened(ws_check_service)
	closeWsIfOpened(ws_route)
}

export function openWsRoute(address: string) {
	ws_route = new WebSocket(address)
}

export function openWsCheckService(address: string) {
	ws_check_service = new WebSocket(address)
}

function onMessage(ws: WebSocket, expectedResponse: ResponseMessage, request: string, callback: jest.DoneCallback) {
	ws.on('message', async (msg: string) => {
		await check_order_message(JSON.parse(msg), expectedResponse, request)
		callback()
	})
}

export function startWebsocket(requestMessage: RequestMessage, expectedResponse: ResponseMessage, callback: jest.DoneCallback) {
	openWsRoute('ws://localhost:3000')
	onMessage(ws_route, expectedResponse, requestMessage.client_request, callback)

	ws_route.on('open', () => {
		ws_route.send(JSON.stringify(requestMessage))
	})
}

export function createConnectionAndCall(requestMessage: RequestMessage, expectedResponse: ResponseMessage, callback: jest.DoneCallback) {
	wss.on('connection', (ws) => {
		ws.on('error', console.error)
		onMessage(ws, expectedResponse, requestMessage.client_request, callback)
	})
	server.listen(8081, () => console.log('listening on port :8081'))

	openWsCheckService('ws://localhost:8081')
	ws_check_service.on('open', () => {
		const managerWsArray = Array()
		check_service(requestMessage, ws_check_service, managerWsArray)
	})
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
	expect(msg.code).toBe(expectedResponse.code)
	expect(msg.message).toBe(expectedResponse.message)
	if (msg.code == 200) {
		if (request == OrdersServiceMessages.CREATE_ORDER) {
			expect(msg.data).toStrictEqual(await addIdandState(expectedData))
			//check ingredient db
			let dbEgg = await (await getCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE)).findOne({ name: "egg" }, { projection: { _id: 0 } })
			const qty = egg.quantity - (omelette.recipe[0].quantity * orderItemQuantity)
			expect(dbEgg?.quantity).toBe(qty)
		} else {
			expect(msg.data).toStrictEqual(expectedData)
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

export const OrderState = {
	PENDING: "PENDING",
	READY: "READY",
	COMPLETED: "COMPLETED"
}

