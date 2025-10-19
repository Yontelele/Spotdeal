import { AbonnemangInCart, CartDto, PhoneInCart } from "../Models/CartDto"

export class RegistreringManager {
  public static createCartRequestDto(
    abonnemangCart: AbonnemangInCart[],
    phoneCart: PhoneInCart[],
    bredbandCart: number | null,
    tvStreamingCart: number | null
  ): CartDto {
    return {
      abonnemangsInCart: abonnemangCart.map((abb) => abb.id),
      phonesInCart: phoneCart.map((p) => ({
        phoneId: p.selectedPhone.id,
        abonnemangId: p.selectedAbonnemang.id,
        isDelbetalning: p.isDelbetalning,
        price: p.phonePrice,
      })),
      bredbandIdInCart: bredbandCart,
      tvStreamingIdInCart: tvStreamingCart,
    }
  }
}
