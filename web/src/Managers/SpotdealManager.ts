import { AbonnemangDto } from "../Models/AbonnemangDto"
import { PhoneDto } from "../Models/PhoneDto"
import { SpotDealDto } from "../Models/SpotDealDto"

export class SpotdealManager {
  public static isSpotdeal(spotdeals: SpotDealDto[], selectedSubscription: AbonnemangDto, selectedPhone: PhoneDto): boolean {
    return spotdeals.some((spotdeal) => spotdeal.phoneId === selectedPhone.id && spotdeal.abonnemangId === selectedSubscription.id)
  }
}
