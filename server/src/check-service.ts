import { MenuServiceMessages, MissingIngredientNotification, OrdersServiceMessages, RequestMessage, ResponseMessage, WarehouseServiceMessages } from './utils/messages'
import { Service } from './utils/service';
import axios from 'axios';

const http = axios.create({
	baseURL: 'http://localhost:8080'
})
const httpOrders = axios.create({
	baseURL: 'http://localhost:8090'
})
const httpMenu = axios.create({
	baseURL: 'http://localhost:8085'
})
/**
 * This function is used to call the correct microservice and API based on the received RequestMessage. 
 * It also sends the answer back through the websocket
	  @param message sent by the client through the websocket
	@param currentWs the websocket communication used
**/
export function check_service(message: RequestMessage, currentWs: any, managerWs: WebSocket[]) {
	console.log('received: %s', message);
	switch (message.client_name) {
		case Service.WAREHOUSE:
			warehouse_api(message.client_request, message.input, currentWs)
			break;
		case Service.MENU:
			menu_api(message.client_request, message.input, currentWs)
			break;
		default:
			orders_api(message.client_request, message.input, currentWs, managerWs)
			break;
	}
}

async function menu_api(message: string, input: string, ws: WebSocket) {
	let names: string[] = []
	switch (message) {
		case MenuServiceMessages.CREATE_ITEM:
			handleResponse(httpMenu.post('/menu/', input), ws)
			break;
		case MenuServiceMessages.GET_ITEMS:
			handleResponse(httpMenu.get('/menu/'), ws)
			break;
		case MenuServiceMessages.UPDATE_ITEM:
			handleResponse(httpMenu.put('/menu/', input), ws)
			break;
		case MenuServiceMessages.GET_AVAILABLE_ITEMS:
			await http.get('/warehouse/available/').then((res) => {
				const availableIng: any[] = res.data

				availableIng.forEach(e => {
					names.push(e.name)
				});

				handleResponse(httpMenu.get('/menu/available/' + JSON.stringify(names)), ws)
			}).catch((e) => {
				ws.send(JSON.stringify(checkErrorMessage(e)))
			})
			break;
		default: //get item by name
			handleResponse(httpMenu.get('/menu/' + input), ws)
			break;
	}
}

function orders_api(message: string, input: string, ws: WebSocket, managerWs: WebSocket[]) {
	switch (message) {
		case OrdersServiceMessages.CREATE_ORDER:
			check_order(input).then((res) => {
				switch (res) {
					case 200:
						handleNewOrder(httpOrders.post('/orders/', input), input, ws, managerWs)
						break
					case 500:
						ws.send(JSON.stringify(createErrorMessage(res, "ERROR_MICROSERVICE_NOT_AVAILABLE")))
						break
					default:
						ws.send(JSON.stringify(createErrorMessage(400, "ERROR_MISSING_INGREDIENTS")))
				}
			})
			break;
		case OrdersServiceMessages.GET_ORDER_BY_ID:
			handleResponse(httpOrders.get('/orders/' + input), ws)
			break;
		case OrdersServiceMessages.PUT_ORDER:
			httpOrders.get('/orders/' + JSON.parse(input)._id).then((res) => {
				res.data["state"] = JSON.parse(input).state
				httpOrders.put('/orders/', res.data).then(() => {
					handleResponse(httpOrders.get('/orders/'), ws)
				}).catch((e) => ws.send(JSON.stringify(checkErrorMessage(e))))
			}).catch((e) => ws.send(JSON.stringify(checkErrorMessage(e))))
			break;
		default: //get all orders
			handleResponse(httpOrders.get('/orders/'), ws)
			break;
	}
}

function warehouse_api(message: string, input: string, ws: WebSocket) {
	switch (message) {
		case WarehouseServiceMessages.CREATE_INGREDIENT:
			handleResponse(http.post('/warehouse/', input), ws)
			break;
		case WarehouseServiceMessages.DECREASE_INGREDIENTS_QUANTITY:
			handleResponse(http.put('/warehouse/', input), ws)
			break;
		case WarehouseServiceMessages.GET_ALL_AVAILABLE_INGREDIENT:
			handleResponse(http.get('/warehouse/available'), ws)
			break;
		case WarehouseServiceMessages.GET_ALL_INGREDIENT:
			handleResponse(http.get('/warehouse/'), ws)
			break;
		// restock
		default: {
			const body = JSON.parse(input)
			const quantity = {
				"quantity": body.quantity
			}
			handleResponse(http.put('/warehouse/' + body.name, quantity), ws)
			break;
		}
	}
}

interface IArray {
	[index: string]: number;
}

async function calcUsedIngredient(item: string, ingredients: IArray, items: IArray) {
	let res = await httpMenu.get('/menu/' + item)
	for (let r of res.data.recipe) {
		let ingredient = r.ingredient_name
		let qty = r.quantity
		ingredients[ingredient] = Object.keys(ingredients).includes(ingredient) ? ingredients[ingredient] + (items[item] * qty) : items[item] * qty
	}
	return ingredients
}

function calcItemNumber(orderItem: any[]) {
	let items = {} as IArray
	orderItem.forEach((i: any) => {
		let item: string = i.item.name.toString()
		let qty: number = i.quantity
		items[item] = Object.keys(items).includes(item) ? items[item] + qty : qty
	})
	return items
}

function getNames(array: any[]) {
	let names = Array()
	array.forEach((i: any) => {
		names.push(i.name)
	})
	return names
}

function getQuantity(array: any[], name: string) {
	return array.filter((i: any) => { return i.name == name })[0].quantity
}

async function check_order(input: any): Promise<number> {
	let response = 500
	await http.get('/warehouse/available/').then(async (res) => {
		const availableIngredients = res.data
		let ingredients = {} as IArray
		const itemNumbers = calcItemNumber(input.items)
		for (let item of Object.keys(itemNumbers)) {
			ingredients = await calcUsedIngredient(item, ingredients, itemNumbers)
		}
		response = (Object.keys(ingredients).filter((name) => {
			return getNames(availableIngredients).includes(name) && (ingredients[name] <= getQuantity(availableIngredients, name))
		}).length == Object.keys(ingredients).length) ? 200 : 400
	}).catch((e) => {
		response = e.response == undefined ? 500 : e.response.status
	})
	return response
}

function handleNewOrder(promise: Promise<any>, input: any, ws: WebSocket, managerWs: WebSocket[]) {
	promise.then(async (res) => {
		if (res.status == 200) {
			const orderItems = input.items
			let ingredients = {} as IArray
			const items = calcItemNumber(orderItems)
			for (let i of Object.keys(items)) {
				ingredients = await calcUsedIngredient(i, ingredients, items)
			}
			let decrease = []
			for (let i of Object.keys(ingredients)) {
				decrease.push({
					"name": i,
					"quantity": ingredients[i]
				})
			}
			http.get('/warehouse/available').then((checkMissingIngredient) => {
				const oldAvailable = checkMissingIngredient.data

				http.put('/warehouse/', decrease).then(() => {
					const msg: ResponseMessage = {
						message: res.statusText,
						code: res.status,
						data: JSON.stringify(res.data)
					}
					ws.send(JSON.stringify(msg))
					checkAndNotify(oldAvailable, managerWs)
				})
			})
		}
	}).catch((error) => {
		const msg = checkErrorMessage(error)
		ws.send(JSON.stringify(msg))
	});
}

function handleResponse(promise: Promise<any>, ws: WebSocket) {
	promise.then((res) => {
		const msg: ResponseMessage = {
			message: res.statusText,
			code: res.status,
			data: JSON.stringify(res.data)
		}
		ws.send(JSON.stringify(msg))
	}).catch((error) => {
		const msg = checkErrorMessage(error)
		ws.send(JSON.stringify(msg))
	});
}

function createErrorMessage(code: number, msg: string) {
	return {
		code: code,
		message: msg,
		data: ""
	}
}

function checkErrorMessage(error: any) {
	return error.response == undefined ? createErrorMessage(500, "ERROR_SERVER_NOT_AVAILABLE") :
		createErrorMessage(error.response.status, error.response.statusText)
}

function checkAndNotify(oldAvailableIngredients: any, managerWs: WebSocket[]) {
	http.get('/warehouse/').then((resAvailable) => {
		let availableIngredientsnames = Array()
		resAvailable.data.forEach((i: any) => {
			if (i.quantity > 0) {
				availableIngredientsnames.push(i.name)
			}
		})

		let missingIngredients = oldAvailableIngredients.filter((i: any) => !availableIngredientsnames.includes(i.name))

		if (missingIngredients.length > 0) {
			const notification: MissingIngredientNotification = {
				message: "NEW_MISSING_INGREDIENTS",
				data: JSON.stringify(missingIngredients)
			}
			managerWs.forEach(ws => {
				ws.send(JSON.stringify(notification))
			})
		}
	})
}
