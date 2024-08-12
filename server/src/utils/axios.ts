import axios from 'axios'

/**
 * Connection with the warehouse microservice
 */
export const http = axios.create({
	baseURL: 'http://localhost:8080'
})

/**
 * Connection with the orders microservice
 */
export const httpOrders = axios.create({
	baseURL: 'http://localhost:8090'
})

/**
 * Connection with the menu microservice
 */
export const httpMenu = axios.create({
	baseURL: 'http://localhost:8085'
})
