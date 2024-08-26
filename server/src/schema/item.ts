export interface Item {
	name: string,
	recipe: IngredientInRecipe[],
	price: number
}

export interface IngredientInRecipe {
	ingredient_name: string,
	quantity: number
}

export interface WarehouseIngredient {
	name: string,
	quantity: number
}

