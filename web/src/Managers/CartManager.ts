import { AbonnemangDto } from "../Models/AbonnemangDto"
import { v4 as uuid } from "uuid"
import { AbonnemangInCart, PhoneInCart } from "../Models/CartDto"

export class CartManager {
  public static generateUniqueIdAbonnemangInCart(abonnemang: AbonnemangInCart | AbonnemangDto): AbonnemangInCart {
    return { ...abonnemang, uniqueId: uuid() }
  }

  public static generateUniqueIdPhoneInCart(phone: PhoneInCart): PhoneInCart {
    return { ...phone, uniqueId: uuid() }
  }

  public static addAbonnemangToCart(
    selectedHuvudAbonnemang: AbonnemangDto,
    abonnemang: AbonnemangDto[],
    abonnemangCart: AbonnemangInCart[]
  ): AbonnemangInCart[] {
    const extraAnvandare = abonnemang.find((abb) => abb.id === selectedHuvudAbonnemang.linkedExtraAnvandareId)

    return [...abonnemangCart, this.generateUniqueIdAbonnemangInCart(extraAnvandare || selectedHuvudAbonnemang)]
  }

  public static addPhoneToCart(phoneCart: PhoneInCart[], selectedPhone: PhoneInCart): PhoneInCart[] {
    return [...phoneCart, this.generateUniqueIdPhoneInCart(selectedPhone)]
  }

  public static isAbonnemangConnectedToPhone(abonnemang: AbonnemangInCart, phoneCart: PhoneInCart[]): boolean {
    return phoneCart.some((phoneInCart) => phoneInCart.selectedAbonnemang.uniqueId === abonnemang.uniqueId)
  }

  public static phoneThatIsConnectedToTheAbonnemang(abonnemang: AbonnemangInCart, phoneCart: PhoneInCart[]): PhoneInCart | null {
    const phone = phoneCart.find((phoneInCart) => phoneInCart.selectedAbonnemang.uniqueId === abonnemang.uniqueId)
    return phone ? phone : null
  }

  public static calculateTotalMonthlyPhonePrice(cart: PhoneInCart[]): number {
    return cart.reduce((total, phone) => {
      if (!phone.phonePricePerMonth) return total
      return total + phone.phonePricePerMonth
    }, 0)
  }

  public static calculateOrdinarieMonthlyAbonnemangPrice(cart: AbonnemangDto[]): number {
    return cart.reduce((total, abb) => total + abb.monthlyPrice, 0)
  }

  public static calculateMonthlyAbonnemangDiscount(cart: AbonnemangDto[]): number {
    return cart.reduce((total, abb) => total + (abb.monthlyDiscount ?? 0), 0)
  }
}
