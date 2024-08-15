import { Component, Inject, Input, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { MenuServiceMessages, RequestMessage, ResponseMessage, WarehouseServiceMessages } from '../../utils/messages';
import { Item } from '../../utils/Item';
import { Service } from '../../utils/service';
import { DialogData } from '../../utils/DialogData';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Ingredient } from '../../utils/Ingredient';
import { IArray } from '../../utils/IArray';
import { buildRecipe } from '../../utils/recipe';
import { checkWsConnectionAndSend } from '../../utils/send';
import { IngredientDialogComponent } from '../item-dialog/item-dialog.component';

/**
 * Component that implements a button that manages 
 * the creation of a new item
 */
@Component({
	selector: 'add-menu-item-button',
	standalone: true,
	imports: [MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		CommonModule,
		MatInputModule],
	templateUrl: './add-menu-item-button.component.html',
	styleUrl: './add-menu-item-button.component.css'
})
export class AddMenuItemButtonComponent {

	constructor(public dialog: MatDialog) { }

	@Input()
	ws!: WebSocket;

	openDialog() {
		this.dialog.open(IngredientDialogComponent, {
			data: {
				ws: this.ws,
				dialog: this.dialog,
				update: false,
				title: "Add a new item",
				buttonMsg: "Add"
			},
		});
	}
}
