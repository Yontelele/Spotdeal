import { OperatorDto } from "./OperatorDto"

export interface AbonnemangDto {
  id: number
  name: string
  registrationName: string
  tableName: string | null
  monthlyPrice: number
  monthlyDiscount: number | null
  monthlyDiscountDuration: number | null
  code: string
  bindningstid: number
  provision: number
  surf: number | null
  extraSurf: number | null
  discount: number
  isFokus: boolean
  showInTable: boolean
  linkedExtraAnvandareId: number | null
  isObegransadSurf: boolean
  canHaveExtraAnvandare: boolean
  isHuvudAbonnemang: boolean
  isBefintligtAbonnemang: boolean
  isForDelbetalningOnly: boolean
  isUngdomsAbonnemang: boolean
  operatorId: number
  operator: OperatorDto
}
