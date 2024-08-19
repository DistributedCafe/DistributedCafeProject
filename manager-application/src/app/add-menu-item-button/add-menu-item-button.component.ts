import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { ItemDialogComponent } from '../item-dialog/item-dialog.component';

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
		this.dialog.open(ItemDialogComponent, {
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
