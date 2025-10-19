import { Get } from "../Authorization/ApiHelper"
import { DashboardDto } from "../Models/DashboardDto"

export const fetchDashboardData = async (): Promise<DashboardDto> => {
  return Get<DashboardDto>("dashboard")
}
