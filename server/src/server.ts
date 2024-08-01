import express from 'express';
import { createServer } from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { check_service } from './check-service';
import { Frontend } from './utils/messages';

/**
 * Script used to initialize the server
 */
const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ server });

let managerWs = Array()
let employeeWs = Array()
let customerWs = Array()

wss.on('connection', (ws: WebSocket) => {

	ws.on('error', console.error);

	ws.on('message', (data: string) => {
		console.log('received: %s', data);

		switch (data) {
			case Frontend.MANAGER:
				managerWs.push(ws)
				break
			case Frontend.EMPLOYEE:
				employeeWs.push(ws)
				break
			case Frontend.CUSTOMER:
				customerWs.push(ws)
				break
			default:
				check_service(JSON.parse(data), ws, managerWs)
		}

	});

	ws.on('open', () => {
		console.log('socket is open');
	});

	ws.on('close', () => {
		employeeWs = employeeWs.filter(w => w != ws)
		customerWs = customerWs.filter(w => w != ws)
		managerWs = managerWs.filter(w => w != ws)
		console.log('socket has closed');
	});
});

server.listen(3000, () => console.log('listening on port :3000'));
