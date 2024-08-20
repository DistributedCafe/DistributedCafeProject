import { MatDialog } from "@angular/material/dialog";
import { Item } from "./Item";
import { Ingredient } from "./Ingredient";

/**
 * This interface represents the data passed to a item dialog or an ingredient dialog
 */
export interface DialogData {
	ws: WebSocket,
	dialog: MatDialog
	title: string,
	buttonMsg: string,
	data: any
}
