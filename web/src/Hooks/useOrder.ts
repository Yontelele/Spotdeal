import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cancelOrder, createOrder, fetchOrder, fetchOrders } from "../Api/OrderApi"
import { CancelOrderDto, OrderDto } from "../Models/OrderDto"
import { CartDto } from "../Models/CartDto"
import { useEffect, useState } from "react"
import { handleApiError } from "../Helpers/ToastHelper"

export const useOrder = (orderId: number) => {
  const { data: order = null, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId,
  })

  useEffect(() => {
    if (error) handleApiError(error)
  }, [error])

  return { order }
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation<OrderDto, Error, CartDto>({
    mutationFn: createOrder,
    retry: 2,
    retryDelay: 1000,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["user"] })
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["order"] })
    },
  })
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { orderId: number; request: CancelOrderDto }>({
    mutationFn: ({ orderId, request }) => cancelOrder(orderId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["user"] })
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["order"] })
    },
  })
}

export const useOrderPage = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage)

  const {
    data: orders = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => fetchOrders(page),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (error) handleApiError(error)
  }, [error])

  return { orders, isLoading, setPage }
}
