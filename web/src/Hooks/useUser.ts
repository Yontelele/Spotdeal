import { useQuery } from "@tanstack/react-query"
import { fetchUser } from "../Api/UserApi"

export const useUser = () => {
  const { data: user = null, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
  })

  return { user, isLoading }
}
