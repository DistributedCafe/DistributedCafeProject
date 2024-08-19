import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { Item } from '../../utils/Item';
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
