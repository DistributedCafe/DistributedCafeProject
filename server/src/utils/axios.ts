import axios from 'axios'

export const http = axios.create({
	baseURL: 'http://localhost:8080'
})
export const httpOrders = axios.create({
	baseURL: 'http://localhost:8090'
})
export const httpMenu = axios.create({
	baseURL: 'http://localhost:8085'
})
