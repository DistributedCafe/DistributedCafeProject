import { Component } from '@angular/core';
import { CartCardComponent } from "../cart-card/cart-card.component";

@Component({
  selector: 'cart',
  standalone: true,
  imports: [CartCardComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  order: any[] = Array()
  totalAmount(cart: any[]) {
    console.log(JSON.stringify(cart))
    let total = 0
    cart.forEach((item: any) => {
      //console.log("--> " + item.price + " -> " + Number(item.price))
      //console.log("--> " + item.quantity + " -> " + Number(item.quantity))
      total = total + (Number(item.price) * Number(item.quantity))
    })
    return total
  }

  constructor() {
    let cart = localStorage.getItem("cart")
    console.log(cart)
    if (cart != null) {
      this.order = JSON.parse(cart)
    }
  }
}
