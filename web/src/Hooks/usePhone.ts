import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { useEffect } from "react"
import { handleApiError } from "../Helpers/ToastHelper"
import { fetchPhones } from "../Api/PhoneApi"

export const usePhone = () => {
  const { data: phones = [], error } = useQuery({
    queryKey: ["phones"],
    queryFn: fetchPhones,
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (error) handleApiError(error)
  }, [error])

  return { phones }
}
