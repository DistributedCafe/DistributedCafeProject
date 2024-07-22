import express, { Request, Response } from "express"
import { StatusCodes } from 'http-status-codes';
import { assertEquals } from 'typia'
import { IngredientInRecipe, Item } from "../domain/item";
import { addNewItem, getItemByName, getAllMenuItems, updateMenuItem, getAllAvailableMenuItems } from "../application/menu-service";
import { MenuMessage } from "../../menu-message";

const router = express.Router();


/**
 * POST '/menu' API handles the addition of a new Item delegating to the service.
 */
router.post('/', async (req: Request, res: Response) => {
	try {
		let item = assertEquals<Item>(req.body)
		let service_res = await addNewItem(item.name, item.price, item.recipe)
		sendResponse(res, service_res.message, service_res.data)
	} catch (error) {
		sendResponse(res, MenuMessage.ERROR_WRONG_PARAMETERS)
	}

});

/**
 * GET '/menu/:name' API handles the retrieval of an Item given the paramete name delegating to the service
 */
router.get('/:name', async (req: Request, res: Response) => {
	let service_res = await getItemByName(req.params['name'])
	sendResponse(res, service_res.message, service_res.data)
})

function sendResponse(res: Response, message: string, data?: any) {
	res.statusMessage = message
	res.statusCode = serviceMessageToCode(res.statusMessage)
	res.json(data)
}

function serviceMessageToCode(service_message: string) {
	switch (service_message) {
		case MenuMessage.OK: {
			return StatusCodes.OK
		}
		case MenuMessage.ERROR_ITEM_NOT_FOUND: {
			return StatusCodes.NOT_FOUND
		}
		case MenuMessage.EMPTY_MENU_DB: {
			return StatusCodes.NOT_FOUND
		}
		default: {
			return StatusCodes.BAD_REQUEST
		}
	}

}

/**
 * GET '/menu' API handles the retrieval of all the Items delegating to the service
 */
router.get('/', async (req: Request, res: Response) => {
	let service_res = await getAllMenuItems()
	sendResponse(res, service_res.message, service_res.data)
})

/**
 * PUT '/menu' API handles the update of an item delegating to the service
 */
router.put('/', async (req: Request, res: Response) => {

	try {
		const recipe = assertEquals<IngredientInRecipe[]>(req.body.recipe)
		const price = assertEquals<number>(req.body.price)
		const set = {
			$set: {
				recipe: recipe,
				price: price
			}
		}
		let service_res = await updateMenuItem(req.body.name, set)
		sendResponse(res, service_res.message, service_res.data)
	} catch (error) {
		sendResponse(res, MenuMessage.ERROR_WRONG_PARAMETERS)
	}


})

/**
 * GET '/available/:availableIngredients' API handles the retrieval of an Item 
 * given the parameter availableIngredients delegating to the service
 */
router.get('/available/:availableIngredients', async (req: Request, res: Response) => {
	try {
		const availableIng = assertEquals<string[]>(JSON.parse(req.params['availableIngredients']))
		let service_res = await getAllAvailableMenuItems(availableIng)
		sendResponse(res, service_res.message, service_res.data)
	} catch (error) {
		sendResponse(res, MenuMessage.ERROR_WRONG_PARAMETERS)
	}

})

export default router;


