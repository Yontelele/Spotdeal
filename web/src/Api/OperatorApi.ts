import { Get } from "../Authorization/ApiHelper"
import { OperatorDto } from "../Models/OperatorDto"

export const fetchOperators = async (): Promise<OperatorDto[]> => {
  return Get<OperatorDto[]>("operator")
}
