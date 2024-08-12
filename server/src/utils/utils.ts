import { http, httpMenu } from "./axios"
import { MissingIngredientNotification, ResponseMessage } from "./messages"
import WebSocket from 'ws'

interface IArray {
	[index: string]: number
}

export function createErrorMessage(code: number, msg: string) {
	return JSON.stringify({
		code: code,
		message: msg,
		data: ""
	})
}

export function checkErrorMessage(error: any) {
	return error.response == undefined ? createErrorMessage(500, "ERROR_SERVER_NOT_AVAILABLE") :
		createErrorMessage(error.response.status, error.response.statusText)
}

async function calcUsedIngredient(item: string, ingredients: IArray, items: IArray) {
	let res = await httpMenu.get('/menu/' + item)
	for (let r of res.data.recipe) {
		let ingredient = r.ingredient_name
		let qty = r.quantity
		ingredients[ingredient] =
			Object.keys(ingredients).includes(ingredient) ?
				ingredients[ingredient] + (items[item] * qty) : items[item] * qty
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

export async function checkOrder(input: any): Promise<number> {
	let response = 500
	await http.get('/warehouse/available/').then(async (res) => {
		const availableIngredients = res.data
		let ingredients = {} as IArray
		const itemNumbers = calcItemNumber(input.items)
		for (let item of Object.keys(itemNumbers)) {
			ingredients = await calcUsedIngredient(item, ingredients, itemNumbers)
		}
		response = (Object.keys(ingredients).filter((name) => {
			return getNames(availableIngredients).includes(name) && (ingredients[name]
				<= getQuantity(availableIngredients, name))
		}).length == Object.keys(ingredients).length) ? 200 : 400
	}).catch((e) => {
		response = e.response == undefined ? 500 : e.response.status
	})
	return response
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
				data: missingIngredients
			}
			managerWs.forEach(ws => {
				ws.send(JSON.stringify(notification))
			})
		}
	})
}

export function handleNewOrder(promise: Promise<any>, input: any, ws: WebSocket, managerWs: WebSocket[]) {
	promise.then(async (res) => {
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
	}).catch((error) => {
		ws.send(checkErrorMessage(error))
	})
}

export function handleResponse(promise: Promise<any>, ws: WebSocket) {
	promise.then((res) => {
		const msg: ResponseMessage = {
			message: res.statusText,
			code: res.status,
			data: JSON.stringify(res.data)
		}
		ws.send(JSON.stringify(msg))
	}).catch((error) => {
		ws.send(checkErrorMessage(error))
	})
}

