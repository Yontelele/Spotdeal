import { fetchDashboardData } from "../Api/DashboardApi"
import { fetchOperators } from "../Api/OperatorApi"
import { useQueryClient } from "@tanstack/react-query"
import { fetchSpotDeals } from "../Api/SpotDealApi"
import { fetchBudget } from "../Api/BudgetApi"
import { fetchPhones } from "../Api/PhoneApi"
import { fetchUser } from "../Api/UserApi"
import { useEffect } from "react"
import { fetchOrders } from "../Api/OrderApi"
import { fetchAbonnemang, fetchAbonnemangInLathundOrMobilDeal } from "../Api/AbonnemangApi"
import { OperatorDto } from "../Models/OperatorDto"
import { fetchBredband } from "../Api/BredbandApi"
import { fetchTvStreaming } from "../Api/TvStreamingApi"
import { Operatorer } from "../Enums/Operatorer"

export const PrefetchData = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const prefetchAll = async () => {
      await queryClient.prefetchQuery({
        queryKey: ["operators"],
        queryFn: fetchOperators,
      })

      const operators = queryClient.getQueryData<OperatorDto[]>(["operators"]) || []

      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ["user"],
          queryFn: fetchUser,
        }),
        queryClient.prefetchQuery({
          queryKey: ["dashboard"],
          queryFn: fetchDashboardData,
        }),
        queryClient.prefetchQuery({
          queryKey: ["abonnemangInLathundOrMobilDeal"],
          queryFn: fetchAbonnemangInLathundOrMobilDeal,
        }),
        queryClient.prefetchQuery({
          queryKey: ["budget"],
          queryFn: fetchBudget,
        }),
        queryClient.prefetchQuery({
          queryKey: ["phones"],
          queryFn: fetchPhones,
        }),
        queryClient.prefetchQuery({
          queryKey: ["spotdeals"],
          queryFn: fetchSpotDeals,
        }),
        queryClient.prefetchQuery({
          queryKey: ["orders", 1],
          queryFn: () => fetchOrders(1),
        }),

        ...operators.map((operator) =>
          queryClient.prefetchQuery({
            queryKey: ["abonnemang", operator.id],
            queryFn: () => fetchAbonnemang(operator.id),
          })
        ),

        ...operators
          .filter((operator) => operator.id !== Operatorer.HALEBOP)
          .map((operator) =>
            queryClient.prefetchQuery({
              queryKey: ["bredband", operator.id],
              queryFn: () => fetchBredband(operator.id),
            })
          ),

        ...operators
          .filter((operator) => operator.id === Operatorer.TELE2 || operator.id === Operatorer.TELIA)
          .map((operator) =>
            queryClient.prefetchQuery({
              queryKey: ["tv", operator.id],
              queryFn: () => fetchTvStreaming(operator.id),
            })
          ),
      ])
    }

    prefetchAll()
  }, [])

  return null
}

export default PrefetchData
