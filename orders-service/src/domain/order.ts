export interface Order {
    _id: string,
    customerContact: string,
    price: number,
    type: OrderType,
    state: OrderState,
    items: OrderItem[]
}

export interface InsertOrder {
    customerContact: string,
    price: number,
    type: OrderType,
    state: OrderState,
    items: OrderItem[]
}

export interface OrderItem { 
    item: Item,
    quantity: number
}

export interface Item {
    name: string
}

export enum OrderType { 
    AT_THE_TABLE = "AT_THE_TABLE",
    TAKE_AWAY = "TAKE_AWAY",
    HOME_DELIVERY = "HOME_DELIVERY"
}

export enum OrderState {
    PENDING = "PENDING",
    READY = "READY",
    COMPLETED = "COMPLETED"
}
