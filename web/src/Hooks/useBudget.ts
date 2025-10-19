import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { handleApiError } from "../Helpers/ToastHelper"
import { fetchBudget } from "../Api/BudgetApi"

export const useBudget = () => {
  const { data: budget = [], error } = useQuery({
    queryKey: ["budget"],
    queryFn: fetchBudget,
  })

  useEffect(() => {
    if (error) handleApiError(error)
  }, [error])

  return { budget }
}
