const cartStorage = "cart"

export function getCartStorage(){
    let cart = localStorage.getItem(cartStorage)
    return cart != null? JSON.parse(cart) : Array()

}

export function setCartStorage(cart: any){
    localStorage.setItem(cartStorage, JSON.stringify(cart))
}