import { AbonnemangDto } from "./AbonnemangDto"
import { PhoneDto } from "./PhoneDto"

export interface SpotDealDto {
  id: number
  abonnemangId: number
  abonnemang: AbonnemangDto
  phoneId: number
  phone: PhoneDto
  discountAmount: number
}
