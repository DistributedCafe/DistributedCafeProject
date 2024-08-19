import { Component, Inject } from '@angular/core';
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
import { DialogDataIngredient } from '../../utils/DialogData';
import { SendButtonComponent } from '../send-button/send-button.component';

@Component({
	selector: 'ingredient-dialog',
	standalone: true,
	imports: [
		MatDialogTitle,
		MatDialogContent,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		CommonModule,
		MatIconModule,
		SendButtonComponent
	],
	templateUrl: './ingredient-dialog.component.html',
	styleUrl: './ingredient-dialog.component.css'
})
export class IngredientDialogComponent {
	quantity = 1
	name = ""

	constructor(@Inject(MAT_DIALOG_DATA) public data: DialogDataIngredient, public dialog: MatDialog) { }

	createRequest() {
		let request: RequestMessage
		if (!this.data.update) {
			request = {
				client_name: Service.WAREHOUSE,
				client_request: WarehouseServiceMessages.CREATE_INGREDIENT,
				input: {
					name: this.name,
					quantity: this.quantity
				}
			}
		} else {
			request = {
				client_name: Service.WAREHOUSE,
				client_request: WarehouseServiceMessages.RESTOCK_INGREDIENT,
				input: {
					name: this.data.ingredient!.name,
					quantity: this.quantity
				}
			}
		}
		return request
	}

}
