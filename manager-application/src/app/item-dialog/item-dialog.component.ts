import { Component, Inject, Input, input, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { Ingredient } from '../../utils/Ingredient';
import { IArray } from '../../utils/IArray';
import { MenuServiceMessages, RequestMessage, ResponseMessage, WarehouseServiceMessages } from '../../utils/messages';
import { Service } from '../../utils/service';
import { checkWsConnectionAndSend } from '../../utils/send';
import { Item } from '../../utils/Item';
import { buildRecipe } from '../../utils/recipe';
import { DialogData } from '../../utils/DialogData';

@Component({
	selector: 'item-dialog',
	standalone: true,
	imports: [FormsModule,
		CommonModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatCheckboxModule,
		MatDialogContent],
	templateUrl: './item-dialog.component.html',
	styleUrl: './item-dialog.component.css'
})
export class IngredientDialogComponent {
	ingredients: Ingredient[] = Array()
	name: string = ''
	price: number = 1
	errorEmpty = false
	errorPrice = false
	error = false
	selectedIngredients: string[] = Array()
	selectedQuantities = {} as IArray
	orderItem!: any

	constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog) {
		const initialRequest: RequestMessage = {
			client_name: Service.WAREHOUSE,
			client_request: WarehouseServiceMessages.GET_ALL_INGREDIENT,
			input: ''
		}
		this.checkConnSendAndCloseDialod(initialRequest, this.data.ws)
		let ingredient: Ingredient[]
		this.data.ws.onmessage = function(e) {
			const data = JSON.parse(e.data) as ResponseMessage
			if (data.code == 200) {
				ingredient = JSON.parse(data.data) as Ingredient[]
				setData(ingredient)
			} else {
				setError(true)
			}
		}
		const setData = (i: Ingredient[]) => {
			this.ingredients = i
			this.ingredients.forEach(i => {
				this.selectedQuantities[i.name] = 1
			})
		}
		const setError = (value: boolean) => {
			this.errorEmpty = value
		}
	}

	closeDialog = () => {
		this.data.dialog.closeAll()
		window.location.reload()
	}

	onCheckChange(name: string) {
		if (this.selectedIngredients.includes(name)) {
			this.selectedIngredients = this.selectedIngredients.filter(i => i !== name)
		} else {
			this.selectedIngredients.push(name)
		}
	}

	checkConnSendAndCloseDialod = (req: RequestMessage, ws: WebSocket) => {
		if (!checkWsConnectionAndSend(req, ws)) {
			this.closeDialog()
		}
	}

	public onClick() {
		if (this.price <= 0) {
			this.errorPrice = true
		} else if (this.selectedIngredients.length <= 0) {
			this.error = true
		} else {
			const data = this.data
			const closeDialog = () => this.closeDialog()
			const openDialog = (msg: ResponseMessage) => {
				this.dialog.open(ErrorDialog, {
					data:
						msg
				});
			}
			const recipe = buildRecipe(this.selectedQuantities, this.selectedIngredients)
			let request: RequestMessage

			if (this.data.update) {
				const input = {
					name: data.item!.name,
					recipe: recipe,
					price: this.price
				}
				
				 request = {
					client_name: Service.MENU,
					client_request: MenuServiceMessages.UPDATE_ITEM,
					input: input
				}
			} else {
				const input: Item = {
					name: this.name,
					recipe: recipe,
					price: this.price
				}

				request = {
					client_name: Service.MENU,
					client_request: MenuServiceMessages.CREATE_ITEM,
					input: input
				}
			}
			this.checkConnSendAndCloseDialod(request, this.data.ws)
			data.ws.onmessage = function(e) {
				const response = JSON.parse(e.data) as ResponseMessage
				if (response.code == 200) {
					console.log(response.message)
					closeDialog()
				} else {
					console.error(response.code)
					console.error(response.message)
					data.dialog.closeAll()
					openDialog(response)
				}
			}
		}

	}
}

/**
 * Component that implements a dialog that shows the occurred error
 */
@Component({
	selector: 'error-item-dialog',
	templateUrl: './error-dialog.html',
	standalone: true,
	styleUrl: './item-dialog.component.css',
	imports: [MatDialogTitle,
		MatDialogContent,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		CommonModule],
})
export class ErrorDialog implements OnDestroy {
	constructor(@Inject(MAT_DIALOG_DATA) public data: ResponseMessage) {
		console.log(data.code)
	}
	ngOnDestroy(): void {
		window.location.reload()
	}
	errorMessage: string = this.data.message
}

