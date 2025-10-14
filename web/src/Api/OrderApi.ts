import { Get, Put, Post } from "../Authorization/ApiHelper"
import { CartDto } from "../Models/CartDto"
import { CancelOrderDto, OrderDto } from "../Models/OrderDto"
import { OrderPageDto } from "../Models/OrderPageDto"

export const fetchOrders = async (page: number): Promise<OrderPageDto> => {
  return Get<OrderPageDto>(`order?page=${page}`)
}

export const fetchOrder = async (orderId: number): Promise<OrderDto> => {
  return Get<OrderDto>(`order/${orderId}`)
}

export const createOrder = async (cart: CartDto): Promise<OrderDto> => {
  return Post<OrderDto>("order", cart)
}

export const cancelOrder = async (orderId: number, request: CancelOrderDto): Promise<void> => {
  return Put<void>(`order/${orderId}/cancel`, request)
}
