import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { OperatorDto } from "../Models/OperatorDto"
import { fetchAbonnemang, fetchAbonnemangInLathundOrMobilDeal } from "../Api/AbonnemangApi"
import { useEffect, useState } from "react"
import { handleApiError } from "../Helpers/ToastHelper"

export const useAbonnemang = () => {
  const [operator, setOperator] = useState<OperatorDto | null>(null)

  const { data: abonnemang = [], error } = useQuery({
    queryKey: ["abonnemang", operator?.id],
    queryFn: () => fetchAbonnemang(operator!.id),
    enabled: !!operator,
  })

  const getAbonnemangForOperator = (newOperator: OperatorDto) => setOperator(newOperator)

  const { data: abonnemangInLathundOrMobilDeal = [], error: lathundOrMobilDealError } = useQuery({
    queryKey: ["abonnemangInLathundOrMobilDeal"],
    queryFn: fetchAbonnemangInLathundOrMobilDeal,
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (error) handleApiError(error)
    if (lathundOrMobilDealError) handleApiError(lathundOrMobilDealError)
  }, [error, lathundOrMobilDealError])

  return {
    abonnemang,
    abonnemangInLathundOrMobilDeal,
    getAbonnemangForOperator,
  }
}
