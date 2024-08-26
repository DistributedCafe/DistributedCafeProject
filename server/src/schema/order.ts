export interface Order {
	customerEmail: string;
	price: number;
	type: string;
	items: OrderItem[];
}

export interface OrderItem {
	item: ItemId;
	quantity: number;
}

export interface ItemId {
	name: string
}

export interface UpdateOrder {
	_id: string,
	state: string
}
