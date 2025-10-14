import { useQuery } from "@tanstack/react-query"
import { fetchDashboardData } from "../Api/DashboardApi"
import { useEffect } from "react"
import { handleApiError } from "../Helpers/ToastHelper"

export const useDashboard = () => {
  const { data: dashboard = null, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  })

  useEffect(() => {
    if (error) handleApiError(error)
  }, [error])

  return { dashboard }
}
