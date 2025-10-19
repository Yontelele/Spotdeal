import { useQuery } from "@tanstack/react-query"
import { fetchBredband } from "../Api/BredbandApi"
import { OperatorDto } from "../Models/OperatorDto"
import { useEffect, useState } from "react"
import { handleApiError } from "../Helpers/ToastHelper"

export const useBredband = () => {
  const [operator, setOperator] = useState<OperatorDto | null>(null)

  const { data: bredband = [], error } = useQuery({
    queryKey: ["bredband", operator?.id],
    queryFn: () => fetchBredband(operator!.id),
    enabled: !!operator,
  })

  const getBredbandForOperator = (newOperator: OperatorDto) => setOperator(newOperator)

  useEffect(() => {
    if (error) handleApiError(error)
  }, [error])

  return { bredband, getBredbandForOperator }
}
