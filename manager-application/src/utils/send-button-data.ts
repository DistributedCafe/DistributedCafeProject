import { MatDialog } from "@angular/material/dialog"
import { RequestMessage } from "./messages"

/**
 * This interface represents the data passed to send button component
 */
export interface SendButtonData {
	ws: WebSocket,
	request: RequestMessage,
	dialog: MatDialog,
	buttonMsg: string,
	isDisabled: boolean
}
