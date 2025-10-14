import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import { getAccessToken } from "../Authorization/AuthConfig"
import { ToastConfig } from "../Helpers/ToastHelper"
import toast from "react-hot-toast"
import { UserDto } from "../Models/UserDto"

export const useSignalR = (user: UserDto) => {
  const queryClient = useQueryClient()

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${BACKEND_URL}/signalr`, {
        accessTokenFactory: async () => {
          const token = await getAccessToken()
          return token
        },
      })
      .configureLogging(import.meta.env.DEV ? LogLevel.Information : LogLevel.Warning)
      .withAutomaticReconnect()
      .build()

    connection.on("orderCreated", (data) => {
      const userId = data.userId
      const userName = data.userName

      if (user.id !== userId) {
        queryClient.invalidateQueries({ queryKey: ["budget"] })
        queryClient.invalidateQueries({ queryKey: ["dashboard"] })
        queryClient.invalidateQueries({ queryKey: ["orders"] })
        queryClient.invalidateQueries({ queryKey: ["order"] })
        toast.success(`${userName || "En kollega"} registrerade en order`, ToastConfig)
      }
    })

    connection.on("orderCancelled", (data) => {
      const userId = data.userId
      const userName = data.userName

      if (user.id !== userId) {
        queryClient.invalidateQueries({ queryKey: ["budget"] })
        queryClient.invalidateQueries({ queryKey: ["dashboard"] })
        queryClient.invalidateQueries({ queryKey: ["orders"] })
        queryClient.invalidateQueries({ queryKey: ["order"] })
        toast.error(`${userName || "En kollega"} har makulerat en order`, ToastConfig)
      }
    })

    connection.start()

    return () => {
      if (connection.state === "Connected") connection.stop()
    }
  }, [])
}
