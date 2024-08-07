import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Item } from '../../utils/Item';
import { beautifyDbName } from '../../utils/utils';

@Component({
  selector: 'item-card',
  standalone: true,
  imports: [MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css'
})
export class ItemCardComponent {
  beautifyDbName(name: string) {
    return beautifyDbName(name)
  }

  @Input()
  item!: Item
  error = false
  quantity = 1

  idItemAdded(cart: any[]) {
    let isPresent = false
    cart.forEach((i: any) => {
      if (i.name == this.item.name) {
        isPresent = true
      }
    })
    return isPresent
  }

  onClick() {
    if (this.quantity > 0) {
      this.error = false
      let newOrderItem = {
        "name": this.item.name,
        "quantity": this.quantity,
        "price": this.item.price
      }

      let cart: any[] = Array()
      if (localStorage.getItem("cart") != null) {
        cart = JSON.parse(localStorage.getItem("cart")!)
      }

      if (!this.idItemAdded(cart)) {
        cart.push(newOrderItem)
      } else {
        cart.forEach((item: any) => {
          if (item.name == this.item.name) {
            item.quantity = item.quantity + this.quantity
          }
        })
      }

      localStorage.setItem("cart", JSON.stringify(cart))
    } else {
      this.error = true
    }
  }
}
