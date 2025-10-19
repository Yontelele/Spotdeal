import { OperatorDto } from "./OperatorDto"
import { StoreDto } from "./StoreDto"

export interface BudgetDto {
  id: number
  storeId: number
  operatorId: number
  year: number
  month: number
  operatorBudget: number
  store: StoreDto
  operator: OperatorDto
  abonnemangSold: number
  progress: number
  trending: number
}
