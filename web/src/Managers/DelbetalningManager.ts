import { Operatorer } from "../Enums/Operatorer"
import { AbonnemangDto } from "../Models/AbonnemangDto"
import { AbonnemangInCart, PhoneInCart } from "../Models/CartDto"

export class DelbetalningManager {
  public static hasOperatorDelbetalningsAbonnemang(operatorId: number): boolean {
    return operatorId === Operatorer.TELIA || operatorId === Operatorer.HALEBOP || operatorId === Operatorer.TELENOR
  }

  public static findDelbetalningAbonnemang(abonnemang: AbonnemangInCart | AbonnemangDto, allAbonnemang: AbonnemangDto[]): AbonnemangDto | null {
    if (!this.hasOperatorDelbetalningsAbonnemang(abonnemang.operatorId)) return null

    return (
      allAbonnemang.find(
        (a) =>
          a.operatorId === abonnemang.operatorId &&
          a.monthlyPrice === abonnemang.monthlyPrice &&
          a.isForDelbetalningOnly &&
          a.isUngdomsAbonnemang === abonnemang.isUngdomsAbonnemang &&
          a.isBefintligtAbonnemang === abonnemang.isBefintligtAbonnemang &&
          a.registrationName === abonnemang.registrationName
      ) || null
    )
  }

  public static findRegularAbonnemang(delbetalningAbonnemang: AbonnemangInCart | AbonnemangDto, allAbonnemang: AbonnemangDto[]): AbonnemangDto | null {
    if (!delbetalningAbonnemang.isForDelbetalningOnly) return null

    return (
      allAbonnemang.find(
        (a) =>
          a.operatorId === delbetalningAbonnemang.operatorId &&
          a.monthlyPrice === delbetalningAbonnemang.monthlyPrice &&
          !a.isForDelbetalningOnly &&
          a.isUngdomsAbonnemang === delbetalningAbonnemang.isUngdomsAbonnemang &&
          a.isBefintligtAbonnemang === delbetalningAbonnemang.isBefintligtAbonnemang &&
          a.registrationName === delbetalningAbonnemang.registrationName
      ) || null
    )
  }

  public static updateCartWithDelbetalningAbonnemang(
    abonnemangCart: AbonnemangInCart[],
    phoneCart: PhoneInCart[],
    allAbonnemang: AbonnemangDto[]
  ): AbonnemangInCart[] {
    return abonnemangCart.map((abonnemang) => {
      const connectedPhone = phoneCart.find((phone) => phone.selectedAbonnemang.uniqueId === abonnemang.uniqueId)

      if (connectedPhone && connectedPhone.isDelbetalning) {
        if (this.hasOperatorDelbetalningsAbonnemang(abonnemang.operatorId) && !abonnemang.isForDelbetalningOnly) {
          const delbetalningAbonnemang = this.findDelbetalningAbonnemang(abonnemang, allAbonnemang)
          if (delbetalningAbonnemang) return { ...delbetalningAbonnemang, uniqueId: abonnemang.uniqueId }
        }
      } else if (abonnemang.isForDelbetalningOnly) {
        const regularAbonnemang = this.findRegularAbonnemang(abonnemang, allAbonnemang)
        if (regularAbonnemang) return { ...regularAbonnemang, uniqueId: abonnemang.uniqueId }
      }

      return abonnemang
    })
  }

  public static updatePhonesWithUpdatedAbonnemang(phoneCart: PhoneInCart[], updatedAbonnemangCart: AbonnemangInCart[]): PhoneInCart[] {
    return phoneCart.map((phone) => {
      const updatedAbonnemang = updatedAbonnemangCart.find((abonnemang) => abonnemang.uniqueId === phone.selectedAbonnemang.uniqueId)
      if (updatedAbonnemang) return { ...phone, selectedAbonnemang: updatedAbonnemang }

      return phone
    })
  }
}
