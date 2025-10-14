import { Get } from "../Authorization/ApiHelper"
import { BredbandDto } from "../Models/BredbandDto"

export const fetchBredband = async (operatorId: number): Promise<BredbandDto[]> => {
  return Get<BredbandDto[]>(`bredband/${operatorId}`)
}
