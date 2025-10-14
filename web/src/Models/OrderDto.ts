import { ContractType } from "../Enums/ContractType"
import { OrderStatus } from "../Enums/OrderStatus"
import { ContractDto } from "./ContractDto"
import { StoreDto } from "./StoreDto"
import { UserDto } from "./UserDto"

export interface OrderDto {
  id: number
  createdAt: Date
  updatedAt: Date
  userId: number
  storeId: number
  status: OrderStatus
  contractType: ContractType
  user: UserDto
  store: StoreDto
  contracts: ContractDto[]
}

export interface CancelOrderDto {
  contractIds: number[]
  reason: string
}
