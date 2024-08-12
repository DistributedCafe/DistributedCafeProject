import { createServer, IncomingMessage, Server, ServerResponse } from "http"
import { OrdersServiceMessages, RequestMessage, ResponseMessage } from "../../src/utils/messages"
import { Service } from "../../src/utils/service"
import { ApiResponse } from "./api-response"
import { DbCollections, DbNames, getCollection } from "./db-connection"
import { addIdandState } from "./order-json-utils"
import { WebSocket, WebSocketServer } from 'ws'
import { checkService } from "../../src/check-service"
import express from "express"
import { egg, omelette, orderItemQuantity } from "./test-data"

const app = express()
export let wsRoute: WebSocket
export let wsCheckService: WebSocket
export let wss: WebSocketServer
export let server: Server<typeof IncomingMessage, typeof ServerResponse>

export function initializeServer() {
	server = createServer(app)
	wss = new WebSocketServer({ server })
}

export function closeWs() {
	closeWsIfOpened(wsCheckService)
	closeWsIfOpened(wsRoute)
}

export function openWsRoute(address: string) {
	wsRoute = new WebSocket(address)
}

export function openWsCheckService(address: string) {
	wsCheckService = new WebSocket(address)
}

function onMessage(ws: WebSocket, expectedResponse: ResponseMessage, request: string, callback: jest.DoneCallback) {
	ws.on('message', async (msg: string) => {
		await checkOrderMessage(JSON.parse(msg), expectedResponse, request)
		callback()
	})
}

export function startWebsocket(requestMessage: RequestMessage, expectedResponse: ResponseMessage, callback: jest.DoneCallback) {
	openWsRoute('ws://localhost:3000')
	onMessage(wsRoute, expectedResponse, requestMessage.client_request, callback)

	wsRoute.on('open', () => {
		wsRoute.send(JSON.stringify(requestMessage))
	})
}

export function createConnectionAndCall(requestMessage: RequestMessage, expectedResponse: ResponseMessage, callback: jest.DoneCallback) {
	wss.on('connection', (ws) => {
		ws.on('error', console.error)
		onMessage(ws, expectedResponse, requestMessage.client_request, callback)
	})
	server.listen(8081, () => console.log('listening on port :8081'))

	openWsCheckService('ws://localhost:8081')
	wsCheckService.on('open', () => {
		const managerWsArray = Array()
		checkService(requestMessage, wsCheckService, managerWsArray)
	})
}

/**
 * Check that the response message is correct
 * @param msg that has to be checked
 * @param expectedResponse correct response
 * @param request request of the client (if needed)
 */
export async function checkOrderMessage(msg: ResponseMessage, expectedResponse: ResponseMessage, request?: string) {
	console.log("MESSAGE: " + msg.message)
	const expectedData = expectedResponse.data
	expect(msg.code).toBe(expectedResponse.code)
	expect(msg.message).toBe(expectedResponse.message)
	if (msg.code == 200) {
		if (request == OrdersServiceMessages.CREATE_ORDER) {
			expect(JSON.parse(msg.data)).toStrictEqual(await addIdandState(expectedData))
			//check ingredient db
			let dbEgg = await (await getCollection(DbNames.WAREHOUSE, DbCollections.WAREHOUSE)).findOne({ name: "egg" }, { projection: { _id: 0 } })
			const qty = egg.quantity - (omelette.recipe[0].quantity * orderItemQuantity)
			expect(dbEgg?.quantity).toBe(qty)
		} else {
			expect(JSON.parse(msg.data)).toStrictEqual(expectedData)
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

