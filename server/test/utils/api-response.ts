
export interface ApiResponse {
	code: number,
	message: string
}

export const OK: ApiResponse = {
	code: 200,
	message: "OK"
}

export const CHANGE_STATE_NOT_VALID: ApiResponse = {
	code: 400,
	message: "CHANGE_STATE_NOT_VALID"
}

export const ORDER_ID_NOT_FOUND: ApiResponse = {
	code: 404,
	message: "ORDER_ID_NOT_FOUND"
}

export const ERROR_MISSING_INGREDIENTS: ApiResponse = {
	code: 400,
	message: "ERROR_MISSING_INGREDIENTS"
}

export const ERROR_WRONG_PARAMETERS: ApiResponse = {
	code: 400,
	message: "ERROR_WRONG_PARAMETERS"
}

export const ERROR_INGREDIENT_NOT_FOUND: ApiResponse = {
	code: 404,
	message: "ERROR_INGREDIENT_NOT_FOUND"
}

export const ERROR_INGREDIENT_ALREADY_EXISTS: ApiResponse = {
	code: 400,
	message: "ERROR_INGREDIENT_ALREADY_EXISTS"
}

export const ERROR_INGREDIENT_QUANTITY: ApiResponse = {
	code: 400,
	message: "ERROR_INGREDIENT_QUANTITY"
}
