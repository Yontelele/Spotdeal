import { AbonnemangDto } from "./AbonnemangDto"
import { PhoneDto } from "./PhoneDto"

export interface CartDto {
  abonnemangsInCart: number[]
  phonesInCart: PhoneInCartDto[]
  bredbandIdInCart: number | null
  tvStreamingIdInCart: number | null
}

export interface AbonnemangInCart extends AbonnemangDto {
  uniqueId: string
}

export interface PhoneInCart {
  uniqueId: string
  selectedPhone: PhoneDto
  selectedAbonnemang: AbonnemangInCart
  phonePricePerMonth: number | null
  phonePrice: number
  isDelbetalning: boolean
}

export interface PhoneInCartDto {
  phoneId: number
  abonnemangId: number
  isDelbetalning: boolean
  price: number
}
