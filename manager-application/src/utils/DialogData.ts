import { MatDialog } from "@angular/material/dialog";
import { Item } from "./Item";

/**
 * This interface represents the data passed to a dialog
 */
export interface DialogData {
	ws: WebSocket,
	dialog: MatDialog
	update: boolean,
	title: string,
	buttonMsg: string,
	item?: Item
}
