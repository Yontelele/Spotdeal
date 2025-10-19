import { Get } from "../Authorization/ApiHelper"
import { AbonnemangDto } from "../Models/AbonnemangDto"

export const fetchAbonnemang = async (operatorId: number): Promise<AbonnemangDto[]> => {
  return Get<AbonnemangDto[]>(`abonnemang/${operatorId}`)
}

export const fetchAbonnemangInLathundOrMobilDeal = async (): Promise<AbonnemangDto[]> => {
  return Get<AbonnemangDto[]>("abonnemang/lathund-mobildeal")
}
