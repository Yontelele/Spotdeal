import { Get } from "../Authorization/ApiHelper"
import { SpotDealDto } from "../Models/SpotDealDto"

export const fetchSpotDeals = async (): Promise<SpotDealDto[]> => {
  return Get<SpotDealDto[]>("spotdeal")
}
