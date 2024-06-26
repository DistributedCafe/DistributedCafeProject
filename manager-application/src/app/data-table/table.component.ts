import {Component} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { RequestMessage, ResponseMessage, WarehouseServiceMessages } from '../../utils/messages';
import { Service } from '../../utils/service';
import { CommonModule } from '@angular/common';

//TODO importa da server (?)
export interface Ingredient {
  name: string;
  quantity: number;
}
/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'dataTable',
  styleUrl: 'table.component.css',
  templateUrl: 'table.component.html',
  standalone: true,
  imports: [MatTableModule,
    CommonModule
  ],
})
export class TableComponent {
  displayedColumns: string[] = ['name', 'quantity'];
  display = false
  dataSource: Ingredient[] = []
 
  constructor(){
    let ws: WebSocket;
    let ingredients: Ingredient[]
    const initialRequest: RequestMessage = {
      client_name: Service.WAREHOUSE,
	    client_request: WarehouseServiceMessages.GET_ALL_INGREDIENT,
	    input: ''
    }

    ws = new WebSocket('ws://localhost:3000');
    ws.onopen = function() {
      console.log("Websocket opend!")
      ws.send(JSON.stringify(initialRequest))
    }

    ws.onmessage = function(e){
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