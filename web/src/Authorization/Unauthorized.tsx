import { useQueryClient } from "@tanstack/react-query"
import { loginRedirect } from "./AuthConfig"

export const Unauthorized = () => {
  const queryClient = useQueryClient()

  function handleLogin() {
    queryClient.clear()
    sessionStorage.clear()
    loginRedirect()
  }

  return (
    <div className="grid h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">:&#40;</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">Åtkomst nekad</h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8 text-wrap">
          Du har inte behörighet att använda denna applikation. Kontakta support om du anser att detta är fel.
        </p>
        <div className="mt-6 flex items-center justify-center gap-x-6">
          <button onClick={handleLogin} className="btn bg-gray-100 text-gray-800 hover:bg-white ">
            Logga in med annat konto
          </button>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
