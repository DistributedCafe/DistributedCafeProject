import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogContent,
	MatDialogTitle,
} from '@angular/material/dialog';
import { Ingredient } from '../../utils/Ingredient';
import { RequestMessage, WarehouseServiceMessages } from '../../utils/messages';
import { Service } from '../../utils/service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SendButtonComponent } from "../send-button/send-button.component";

/**
 * Component that implements a button that manages 
 * the restock of an ingredient
 */
@Component({
	selector: 'restock-button',
	standalone: true,
	imports: [
		MatButtonModule,
		MatIconModule,
		CommonModule],
	templateUrl: './restock-button.component.html',
	styleUrl: './restock-button.component.css'
})
export class RestockButtonComponent {
	@Input()
	ws!: WebSocket;
	@Input()
	ingredient!: Ingredient;

	constructor(public dialog: MatDialog) { }
	openDialog() {
		this.dialog.open(Dialog, {
			data: {
				ingredient: this.ingredient,
				ws: this.ws,
				dialog: this.dialog
			},
		});
	}
}

/**
 * Component that implements a dialog containing a 
 * form to insert the quantity to add (greater than 0) 
 * to the ingredient and a button that send
 * a message to the server
 */
@Component({
	selector: 'restock-button-dialog',
	templateUrl: './dialog.html',
	standalone: true,
	styleUrl: './restock-button.component.css',
	imports: [MatDialogTitle,
		MatDialogContent,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		CommonModule, SendButtonComponent],
})
export class Dialog {
	constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog) { }
	showError = false
	request: RequestMessage = {
		client_name: Service.WAREHOUSE,
		client_request: WarehouseServiceMessages.RESTOCK_INGREDIENT,
		input: {
			name: this.data.ingredient.name,
			quantity: 1
		}
	}
}

export interface DialogData {
	ingredient: Ingredient,
	ws: WebSocket,
	dialog: MatDialog
}
