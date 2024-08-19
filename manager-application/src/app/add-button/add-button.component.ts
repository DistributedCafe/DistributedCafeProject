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
import { RequestMessage, WarehouseServiceMessages } from '../../utils/messages';
import { Service } from '../../utils/service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogData } from '../../utils/DialogData';
import { SendButtonComponent } from '../send-button/send-button.component';

/**
 * Component that implements a button that manages 
 * the creation of a new ingredient
 */
@Component({
	selector: 'add-button',
	standalone: true,
	imports: [MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule],
	templateUrl: './add-button.component.html',
	styleUrl: './add-button.component.css'
})
export class AddButtonComponent {
	constructor(public dialog: MatDialog) { }
	@Input()
	ws!: WebSocket;

	openDialog() {
		this.dialog.open(Dialog, {
			data: {
				ws: this.ws,
				dialog: this.dialog
			},
		});
	}
}

/**
 * Component that implements a dialog containing a 
 * form to insert all the necessary information 
 * about the new ingredient and a button that send
 * a message to the server
 */
@Component({
	selector: 'add-button-dialog',
	templateUrl: './dialog.html',
	standalone: true,
	styleUrl: './add-button.component.css',
	imports: [MatDialogTitle,
		MatDialogContent,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		CommonModule,
		MatIconModule,
		SendButtonComponent],
})
export class Dialog {
	constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
	request: RequestMessage = {
		client_name: Service.WAREHOUSE,
		client_request: WarehouseServiceMessages.CREATE_INGREDIENT,
		input: {
			name: "",
			quantity: 1
		}
	}
}
