import { ContractStatus } from "../Enums/ContractStatus"
import { ContractCodeDto } from "./ContractCodeDto"
import { UserDto } from "./UserDto"

export interface ContractDto {
  id: number
  orderId: number
  abonnemangId: number
  bredbandId: number
  tvStreamingId: number
  name: string
  bindningstid: number
  monthlyPrice: number | null
  monthlyDiscount: number | null
  monthlyDiscountDuration: number | null
  provision: number
  extraSurf: number | null
  isFokus: boolean
  operatorId: number
  operatorName: string
  operatorLogoUrl: string
  phoneId: number | null
  isDelbetalning: boolean | null
  phoneCostAfterDiscount: number | null
  phoneBrand: string | null
  phoneModel: string | null
  phoneStorage: string | null
  phoneColor: string | null
  phonePrice: number | null
  phoneCode: string | null
  imageUrl: string | null
  contractCodes: ContractCodeDto[]
  status: ContractStatus
  cancelledByUserId: number | null
  cancellationReason: string | null
  cancelledByUser: UserDto | null
  cancelledAt: Date
}
