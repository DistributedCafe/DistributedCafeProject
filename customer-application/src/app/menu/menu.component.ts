import { Component } from '@angular/core';
import { ItemCardComponent } from "../item-card/item-card.component";
import { Item } from '../../utils/Item';
import { MenuServiceMessages, RequestMessage, ResponseMessage } from '../../utils/message';
import { Service } from '../../utils/service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ItemCardComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  ws!: WebSocket
  items: Item[] = []

  constructor() {
    this.ws = new WebSocket('ws://localhost:3000')

    // TODO CONTROLLI

    const request: RequestMessage = {
      client_name: Service.MENU,
      client_request: MenuServiceMessages.GET_AVAILABLE_ITEMS,
      input: ""
    }

    this.ws.onerror = () => {
      this.ws.close()
    }

    this.ws.onopen = function(e) {
      this.send(JSON.stringify(request))
    }

    this.ws.onmessage = function(e) {
      let data = JSON.parse(e.data) as ResponseMessage
      setItems(JSON.parse(data.data))
    }
    const setItems = (items: []) => {
      this.items = items
    }
  }

}
