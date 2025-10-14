import { Get } from "../Authorization/ApiHelper"
import { MobilDealDto } from "../Models/MobilDealDto"

export const fetchMobilDeal = async (phoneId: number): Promise<MobilDealDto> => {
  return Get<MobilDealDto>(`mobildeal/${phoneId}`)
}
