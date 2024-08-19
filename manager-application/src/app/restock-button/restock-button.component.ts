import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Ingredient } from '../../utils/Ingredient';
import { CommonModule } from '@angular/common';
import { IngredientDialogComponent } from '../ingredient-dialog/ingredient-dialog.component';


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
		this.dialog.open(IngredientDialogComponent, {
			data: {
				title: "Ingredient: " + this.ingredient.name,
				buttonMsg: "Restock",
				update: true,
				ingredient: this.ingredient,
				ws: this.ws,
				dialog: this.dialog
			},
		});
	}
}
