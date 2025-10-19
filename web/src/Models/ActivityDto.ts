import { ContractType } from "../Enums/ContractType"
import { EventType } from "../Enums/EventType"

export interface ActivityDto {
  orderId: number
  eventType: EventType
  contractType: ContractType
  firstName: string
  lastName: string
  contractCount: number
  isFokus: boolean
  operatorName: string
  eventTime: Date
}
