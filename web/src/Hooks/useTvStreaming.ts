import { useQuery } from "@tanstack/react-query"
import { OperatorDto } from "../Models/OperatorDto"
import { useEffect, useState } from "react"
import { handleApiError } from "../Helpers/ToastHelper"
import { fetchTvStreaming } from "../Api/TvStreamingApi"

export const useTvStreaming = () => {
  const [operator, setOperator] = useState<OperatorDto | null>(null)

  const { data: tvStreaming = [], error } = useQuery({
    queryKey: ["tv", operator?.id],
    queryFn: () => fetchTvStreaming(operator!.id),
    enabled: !!operator,
  })

  const getTvStreamingForOperator = (newOperator: OperatorDto) => setOperator(newOperator)

  useEffect(() => {
    if (error) handleApiError(error)
  }, [error])

  return { tvStreaming, getTvStreamingForOperator }
}
