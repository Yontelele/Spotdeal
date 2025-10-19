import { UserRole } from "../Enums/UserRole"
import { StoreDto } from "./StoreDto"

export interface UserDto {
  id: number
  firstName: string
  lastName: string
  role: UserRole
  storeId: number
  abonnemangSold: number
  fokusAbonnemangSold: number
  bredbandSold: number
  tvStreamingSold: number
  provision: number
  store: StoreDto
}
