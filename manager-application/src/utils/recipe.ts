import { IArray } from "./IArray"
import { IngredientInRecipe } from "./Item"

export function buildRecipe(selectedQuantities: IArray, selectedIngredients: string[]): IngredientInRecipe[] {
	let recipe = Array()
	Object.keys(selectedQuantities).forEach(i => {
		if (selectedIngredients.includes(i)) {
			let newItem = {
				ingredient_name: i,
				quantity: selectedQuantities[i]
			}
			recipe.push(newItem)
		}
	})
	console.log(recipe)
	return recipe
}
