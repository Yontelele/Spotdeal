import { useMutation } from "@tanstack/react-query"
import { fetchContractCodes } from "../Api/ContractApi"
import { CartDto } from "../Models/CartDto"
import { ContractCodeListDto } from "../Models/ContractCodeListDto"

export const useContractCodes = () => {
  return useMutation<ContractCodeListDto[], Error, CartDto>({
    mutationFn: fetchContractCodes,
    retry: 2,
    retryDelay: 1000,
  })
}
