import { useEffect } from "react"
import { fetchOperators } from "../Api/OperatorApi"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { handleApiError } from "../Helpers/ToastHelper"

export const useOperator = () => {
  const { data: operators = [], error } = useQuery({
    queryKey: ["operators"],
    queryFn: fetchOperators,
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (error) handleApiError(error)
  }, [error])

  return { operators }
}
