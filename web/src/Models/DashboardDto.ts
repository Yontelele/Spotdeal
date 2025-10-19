import { ActivityFeedDto } from "./ActivityFeedDto"
import { DailySalesDto } from "./DailySalesDto"
import { UserDto } from "./UserDto"

export interface DashboardDto {
  budget: number
  abonnemangSold: number
  trendingProcent: number
  dailySales: DailySalesDto[]
  activityFeed: ActivityFeedDto
  sellers: UserDto[]
}
