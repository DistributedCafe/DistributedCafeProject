import {Component} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { RequestMessage, ResponseMessage, WarehouseServiceMessages } from '../../utils/messages';
import { Service } from '../../utils/service';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RestockButtonComponent } from '../restock-button/restock-button.component';
import { Ingredient } from '../../utils/Ingredient';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'dataTable',
  styleUrl: 'table.component.css',
  templateUrl: 'table.component.html',
  standalone: true,
  imports: [MatTableModule,
    CommonModule,
    MatProgressSpinnerModule,
    RestockButtonComponent],
})
export class TableComponent {
  displayedColumns: string[] = ['name', 'quantity', 'restock'];
  display = false
  dataSource: Ingredient[] = []
  ws: WebSocket = new WebSocket('ws://localhost:3000');
  
  constructor(){ 
    let ingredients: Ingredient[]
    const initialRequest: RequestMessage = {
      client_name: Service.WAREHOUSE,
	    client_request: WarehouseServiceMessages.GET_ALL_INGREDIENT,
	    input: ''
    }
    this.ws.onopen = function() {
      console.log("Websocket opend!")
      this.send(JSON.stringify(initialRequest))
    }

    this.ws.onmessage = function(e){
      const data = JSON.parse(e.data) as ResponseMessage
      console.log("message: " + data.message)
      console.log("code: " + data.code)
      ingredients = JSON.parse(data.data) as Ingredient []
      setData(ingredients, true)
    }
    const setData = (ingredients: Ingredient[], display: boolean) =>{
      this.dataSource = ingredients
      this.display = display
    }
  }
}