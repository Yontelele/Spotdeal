import { NavLink } from "react-router-dom"
import { RouteNames } from "../Enums/RouteNames"

export const NotFound = () => (
  <div className="grid h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
    <div className="text-center">
      <p className="text-base font-semibold text-indigo-600">404</p>
      <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">Sidan du söker efter existerar inte</h1>
      <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">Inga abonnemang gömmer sig här :&#40;</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <NavLink end to={RouteNames.RegistreraAbonnemangPage} className="btn bg-gray-100 text-gray-800 hover:bg-white">
          Navigera mig tillbaka
        </NavLink>
      </div>
    </div>
  </div>
)

export default NotFound
