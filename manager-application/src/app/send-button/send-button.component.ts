import { checkWsConnectionAndSend } from '../../utils/send';
import { Component, Inject, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogContent,
	MatDialogTitle,
} from '@angular/material/dialog';
import { ResponseMessage } from '../../utils/messages';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SendButtonData } from '../../utils/sendButtonData';

/**
 * Button component that sends a request and, in case of an error,
 * shows an error dialog.
 */
@Component({
	selector: 'send-button',
	standalone: true,
	imports: [MatButtonModule],
	templateUrl: './send-button.component.html',
	styleUrl: './send-button.component.css'
})
export class SendButtonComponent {

	@Input()
	input!: SendButtonData

	constructor(private errorDialog: MatDialog) { }

	onClick() {
		const openDialog = (msg: ResponseMessage) => {
			this.errorDialog.open(ErrorDialog, {
				data:
					msg
			});
		}

		const closeDialog = () => { this.input.dialog.closeAll() }

		const closeAndReloadDialog = () => {
			closeDialog()
			window.location.reload()
		}

		if (!checkWsConnectionAndSend(this.input.request, this.input.ws)) {
			closeDialog()
		}

		this.input.ws.onmessage = function(e) {
			const res = JSON.parse(e.data) as ResponseMessage
			if (res.code == 200) {
				console.log(res.message)
				closeAndReloadDialog()
			} else {
				console.error(res.code)
				console.error(res.message)
				closeDialog()
				openDialog(res)
			}
		}
	}
}

/**
* Component that implements a dialog that shows the occurred error
*/
@Component({
	selector: 'send-button-error-dialog',
	templateUrl: './error-dialog.html',
	standalone: true,
	styleUrl: './send-button.component.css',
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

