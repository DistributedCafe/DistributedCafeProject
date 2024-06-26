import {Component} from '@angular/core';
import {MatTableModule} from '@angular/material/table';

//TODO importa da server (?)
export interface Ingredient {
  name: string;
  quantity: number;
}

const ELEMENT_DATA: Ingredient[] = [
  {name: 'Milk', quantity: 100},
  {name: 'Coffe', quantity: 9},
  {name: 'Kiwi', quantity: 70},
];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'dataTable',
  styleUrl: 'table.component.css',
  templateUrl: 'table.component.html',
  standalone: true,
  imports: [MatTableModule],
})
export class TableComponent {
  displayedColumns: string[] = ['name', 'quantity'];
  dataSource = ELEMENT_DATA;
}