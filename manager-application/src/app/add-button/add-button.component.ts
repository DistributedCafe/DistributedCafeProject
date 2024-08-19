import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { IngredientDialogComponent } from '../ingredient-dialog/ingredient-dialog.component';

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
		this.dialog.open(IngredientDialogComponent, {
			data: {
				title: "Add a new ingredient",
				buttonMsg: "Add",
				update: false,
				ws: this.ws,
				dialog: this.dialog
			},
		});
	}
}
