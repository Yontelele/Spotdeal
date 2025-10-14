import { AbonnemangDto } from "./AbonnemangDto"
import { PhoneDto } from "./PhoneDto"

export interface MobilDealDto {
  phone: PhoneDto
  totalAvailableDeals: number
  mobildeals: MobilDeal[]
}

export interface MobilDeal {
  totalMonthlyCost: number
  phoneMontlyCost: number
  phoneDiscount: number
  isSpotDeal: boolean
  categories: string[]
  score: number
  abonnemang: AbonnemangDto
}

export interface PhoneInMobilDeal {
  selectedPhone: PhoneDto
  phonePricePerMonth: number
  phonePrice: number
  isDelbetalning: boolean
}
