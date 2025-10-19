import { Post } from "../Authorization/ApiHelper"
import { CartDto } from "../Models/CartDto"
import { ContractCodeListDto } from "../Models/ContractCodeListDto"

export const fetchContractCodes = async (cart: CartDto): Promise<ContractCodeListDto[]> => {
  return Post<ContractCodeListDto[]>("contract/code", cart)
}
