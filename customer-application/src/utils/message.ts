import { Service } from "./service"

/**
 * This interface represents the request the client sends to the server
 */
export interface RequestMessage {
  client_name: Service
  client_request: string
  input: any
}

/**
 * This interface represents the response the client receives from the server
 */
export interface ResponseMessage {
  message: string,
  code: number,
  data: string
}

/**
 * Different messages handled by the menu microservice
 */
export const MenuServiceMessages = {
  CREATE_ITEM: 'CREATE_ITEM',
  GET_ITEM_BY_NAME: 'GET_ITEM_BY_NAME',
  UPDATE_ITEM: 'UPDATE_ITEM',
  GET_ITEMS: 'GET_ITEMS',
  GET_AVAILABLE_ITEMS: 'GET_AVAILABLE_ITEMS'
}
Object.freeze(MenuServiceMessages)
