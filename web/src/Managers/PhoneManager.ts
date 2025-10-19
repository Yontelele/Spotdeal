import { Operatorer } from "../Enums/Operatorer"
import { AbonnemangDto } from "../Models/AbonnemangDto"
import { PhoneDto } from "../Models/PhoneDto"
import { SpotDealDto } from "../Models/SpotDealDto"

export class PhoneManager {
  public static calculateTotalPriceOnPhone(phone: PhoneDto, discount: number): number {
    return this.calculateMonthlyPriceOnPhone(phone, discount) * 24
  }

  public static calculateMonthlyPriceOnPhone(phone: PhoneDto, discount: number): number {
    let result = Math.round((phone.price - discount) / 24 / 10) * 10

    if (result * 24 > phone.price) {
      result = Math.floor((phone.price - discount) / 24 / 10) * 10
    }

    return Math.max(0, result)
  }

  public static calculateTeliaTotalPriceOnPhone(phone: PhoneDto, discount: number): number {
    const netPrice = phone.price - discount

    const lowerHundreds = Math.floor(netPrice / 100) * 100
    const upperHundreds = lowerHundreds + 100

    const lowerPrice = lowerHundreds - 10
    const upperPrice = upperHundreds - 10

    const distanceToLower = netPrice - lowerPrice
    const distanceToUpper = upperPrice - netPrice

    if (upperPrice > phone.price || distanceToLower <= distanceToUpper) {
      return lowerPrice
    } else {
      return upperPrice
    }
  }

  public static calculateTeliaMonthlyPriceOnPhone(phone: PhoneDto, discount: number): number {
    const totalPrice = this.calculateTeliaTotalPriceOnPhone(phone, discount)
    const monthlyPrice = Math.round(totalPrice / 24)

    return Math.max(0, monthlyPrice)
  }

  public static getDiscountOnSelectedPhone(spotdeals: SpotDealDto[], selectedSubscription: AbonnemangDto, selectedPhone: PhoneDto): number {
    const matchingSpotdeal = spotdeals.find((spotdeal) => spotdeal.phoneId === selectedPhone.id && spotdeal.abonnemangId === selectedSubscription.id)

    return matchingSpotdeal ? matchingSpotdeal.discountAmount : selectedSubscription.discount
  }

  public static isPhonePriceValid(operatorId: number, monthlyPrice: number): { isValid: boolean; errorMessage: string } {
    if ((operatorId === Operatorer.TELIA || operatorId === Operatorer.HALEBOP) && monthlyPrice < 50 && monthlyPrice !== 0) {
      return {
        isValid: false,
        errorMessage: "För Telia måste telefonens kostnad vara minst 50 kr/mån.",
      }
    }

    if (monthlyPrice < 10 && monthlyPrice !== 0) {
      return {
        isValid: false,
        errorMessage: "För den valda operatören måste hårdvarans månadskostnad vara minst 10 kr.",
      }
    }

    return { isValid: true, errorMessage: "" }
  }
}
