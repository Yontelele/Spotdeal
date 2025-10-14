import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchSpotDeals } from "../Api/SpotDealApi"
import { useEffect } from "react"
import { handleApiError } from "../Helpers/ToastHelper"

export const useSpotDeal = () => {
  const { data: spotdeals = [], error } = useQuery({
    queryKey: ["spotdeals"],
    queryFn: fetchSpotDeals,
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (error) handleApiError(error)
  }, [error])

  return { spotdeals }
}
