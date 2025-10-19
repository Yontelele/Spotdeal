import { ActivityDto } from "./ActivityDto"

export interface ActivityFeedDto {
  today: ActivityDto[]
  yesterday: ActivityDto[]
  twoDaysAgo: ActivityDto[]
  older: ActivityDto[]
}
