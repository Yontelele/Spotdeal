import { OrderDto } from "./OrderDto"

export interface OrderPageDto {
  pageNumber: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  orders: OrderDto[]
}
