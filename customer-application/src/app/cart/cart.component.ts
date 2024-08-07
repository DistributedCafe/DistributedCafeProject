import { Component } from '@angular/core';
import { CartCardComponent } from "../cart-card/cart-card.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import validator from 'email-validator'
import { NewOrder, OrderType } from '../../utils/order';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [CartCardComponent,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatRadioModule,
    CommonModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  order: any[] = Array()
  email: string = ""
  type!: OrderType;
  errorEmail = false
  errorType = false
  errorEmptyCart = false

  totalAmount(cart: any[]) {
    let total = 0
    cart.forEach((item: any) => {
      total = total + (Number(item.price) * Number(item.quantity))
    })
    return total
  }

  navigateMenu() {
    this.router.navigate([""])
  }

  validateEmail() {
    return validator.validate(this.email)
  }

  orderTypes = [OrderType.AT_THE_TABLE, OrderType.HOME_DELIVERY, OrderType.TAKE_AWAY]

  constructor(private router: Router) {
    let cart = localStorage.getItem("cart")
    console.log(cart)
    if (cart != null) {
      this.order = JSON.parse(cart)
    }
  }

  sendOrder() {
    if (this.validateEmail()) {
      this.errorEmail = false
      if (this.type != undefined) {
        this.errorType = false
        if (this.order.length > 0) {
          this.errorEmptyCart = false
          const order: NewOrder = {
            customerEmail: this.email,
            price: this.totalAmount(this.order),
            type: this.type,
            items: this.order
          }
          console.log(JSON.stringify(order))
        } else {
          this.errorEmptyCart = true
        }
      } else {
        this.errorType = true
      }
    } else {
      this.errorEmail = true
    }
  }
}
