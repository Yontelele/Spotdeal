import "./App.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RegistreringProvider } from "./Context/RegistreringContext"
import { PhoneProvider } from "./Context/PhoneContext"
import { CartProvider } from "./Context/CartContext"
import { AppProvider } from "./Context/AppContext"
import { Routing } from "./Authorization/Routing"
import { Toaster } from "react-hot-toast"
import { ApiError } from "./Authorization/ApiHelper"
import PrefetchData from "./Hooks/PrefetchData"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 403) return false
        return failureCount < 1
      },
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <CartProvider>
          <PhoneProvider>
            <RegistreringProvider>
              <PrefetchData />
              <Routing />
              <Toaster position="bottom-right" />
            </RegistreringProvider>
          </PhoneProvider>
        </CartProvider>
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App
