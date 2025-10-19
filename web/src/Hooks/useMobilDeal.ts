import { useMutation } from "@tanstack/react-query"
import { fetchMobilDeal } from "../Api/MobilDealApi"
import { MobilDealDto } from "../Models/MobilDealDto"

export const useMobilDeal = () => {
  return useMutation<MobilDealDto, Error, number>({
    mutationFn: fetchMobilDeal,
    retry: 2,
    retryDelay: 1000,
  })
}
