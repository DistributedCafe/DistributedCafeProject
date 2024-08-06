import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { beautifyDbName } from '../../utils/utils';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'cart-card',
  standalone: true,
  imports: [MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './cart-card.component.html',
  styleUrl: './cart-card.component.css'
})
export class CartCardComponent {

  @Input()
  orderItem!: any

  quantity = 1

  beautifyDbName(name: string) {
    return beautifyDbName(name)
  }

  update() {
    let cart = JSON.parse(localStorage.getItem("cart")!)
    cart.forEach((item: any) => {
      if (item.name == this.orderItem.name) {
        item.quantity = this.orderItem.quantity
      }
    })
    localStorage.setItem("cart", JSON.stringify(cart))
    console.log(localStorage.getItem("cart"))
  }
}
