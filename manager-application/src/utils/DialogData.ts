import { MatDialog } from "@angular/material/dialog";
import { Item } from "./Item";
import { Ingredient } from "./Ingredient";

interface DialogData {
	ws: WebSocket,
	dialog: MatDialog
	title: string,
	buttonMsg: string,
}

/**
 * This interface represents the data passed to a item dialog
 */
export interface DialogDataItems extends DialogData {
	item?: Item
}

/**
 * This interface represents the data passed to a ingredient dialog
 */
export interface DialogDataIngredient extends DialogData {
	ingredient?: Ingredient
}
