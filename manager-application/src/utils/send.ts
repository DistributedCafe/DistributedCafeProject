import { RequestMessage } from "./messages"

export function checkWsConnectionAndSend(request: RequestMessage, ws: WebSocket) {
	const isConnected = (ws.readyState == WebSocket.OPEN)
	if (isConnected) {
		ws.send(JSON.stringify(request))
	}
	return isConnected
}
