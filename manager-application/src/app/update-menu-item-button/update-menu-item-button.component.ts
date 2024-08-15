import { Component, Inject, Input, OnDestroy } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Item } from '../../utils/Item';
import { MenuServiceMessages, RequestMessage, ResponseMessage, WarehouseServiceMessages } from '../../utils/messages';
import { Service } from '../../utils/service';
import { Ingredient } from '../../utils/Ingredient';
import { IArray } from '../../utils/IArray';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { buildRecipe } from '../../utils/recipe';
import { checkWsConnectionAndSend } from '../../utils/send';
import { IngredientDialogComponent } from '../item-dialog/item-dialog.component';

/**
 * Component that implements a button that manages 
 * the update of an item
 */
@Component({
	selector: 'update-menu-item-button',
	standalone: true,
	imports: [MatButtonModule,
		MatIconModule,
		MatInputModule
	],
	templateUrl: './update-menu-item-button.component.html',
	styleUrl: './update-menu-item-button.component.css'
})
export class UpdateMenuItemButtonComponent {
	@Input()
	ws!: WebSocket
	@Input()
	item!: Item

	constructor(public dialog: MatDialog) { }
	openDialog() {
		this.dialog.open(IngredientDialogComponent, {
			data: {
				ws: this.ws,
				dialog: this.dialog,
				update: true,
				title: "Update " + this.item.name,
				buttonMsg: "Update",
				item: this.item
			},
		});
	}
}