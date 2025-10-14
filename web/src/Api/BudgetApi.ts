import { Get } from "../Authorization/ApiHelper"
import { BudgetDto } from "../Models/BudgetDto"

export const fetchBudget = async (): Promise<BudgetDto[]> => {
  return Get<BudgetDto[]>("budget")
}
