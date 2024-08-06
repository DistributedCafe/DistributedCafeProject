import { Component } from '@angular/core';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  constructor() {
    console.log(localStorage.getItem("cart"))
  }

}
