import toast from "react-hot-toast"
import { ApiError } from "../Authorization/ApiHelper"

export const ToastConfig = {
  duration: 3500,
  style: { background: "#1f2937", color: "#e5e7eb" },
}

export const handleApiError = (error: Error) => {
  if (error instanceof ApiError && error.status === 403) return
  toast.error(error.message, ToastConfig)
}
