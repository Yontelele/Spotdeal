import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { RouteNames } from "../Enums/RouteNames"
import { ReactNode } from "react"
import { useUser } from "../Hooks/useUser"
import OperatorSelectBredband from "../Components/Pages/RegistreringPage/Bredband/OperatorSelectBredband"
import RegistreraBredband from "../Components/Pages/RegistreringPage/Bredband/RegistreraBredband"
import OperatorSelectTV from "../Components/Pages/RegistreringPage/TV/OperatorSelectTV"
import Operatorspriser from "../Components/Pages/OperatorpriserPage/Operatorpriser"
import RegistreraOrder from "../Components/Pages/RegistreringPage/RegistreraOrder"
import OperatorSelect from "../Components/Pages/RegistreringPage/OperatorSelect"
import LoadingSpinner from "../Components/Common/LoadingSpinner"
import ContractCodes from "../Components/Pages/RegistreringPage/ContractCodes"
import Orderhistorik from "../Components/Pages/OrderPage/Orderhistorik"
import RegistreraTV from "../Components/Pages/RegistreringPage/TV/RegistreraTV"
import Unauthorized from "./Unauthorized"
import MobilDeal from "../Components/Pages/MobilDealPage/MobilDeal"
import NotFound from "./NotFound"
import SignalR from "../Hooks/SignalR"
import Varuhus from "../Components/Pages/VaruhusPage/Varuhus"
import Order from "../Components/Pages/OrderPage/Order"

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useUser()

  if (isLoading) return <LoadingSpinner text="Loggar in..." variant="global" />

  return user ? (
    <>
      <SignalR user={user} />
      {children}
    </>
  ) : (
    <Navigate to={RouteNames.UnauthorizedPage} replace />
  )
}

export const Routing = () => (
  <Routes>
    <Route path={RouteNames.UnauthorizedPage} element={<Unauthorized />} />

    <Route
      element={
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      }
    >
      <Route path="/" element={<Navigate to={RouteNames.RegistreraAbonnemangPage} replace />} />

      <Route path={RouteNames.RegistreraAbonnemangPage} element={<OperatorSelect />} />
      <Route path={RouteNames.RegistreraBredbandPage} element={<OperatorSelectBredband />} />
      <Route path={RouteNames.RegistreraTvPage} element={<OperatorSelectTV />} />

      <Route path={RouteNames.RegistreraAbonnemangPage + "/:operator"} element={<RegistreraOrder />} />
      <Route path={RouteNames.RegistreraBredbandPage + "/:operator"} element={<RegistreraBredband />} />
      <Route path={RouteNames.RegistreraTvPage + "/:operator"} element={<RegistreraTV />} />

      <Route path={RouteNames.RegistreringskoderPage} element={<ContractCodes />} />
      <Route path={RouteNames.MobilDealPage} element={<MobilDeal />} />
      <Route path={RouteNames.LathundPage} element={<Operatorspriser />} />
      <Route path={RouteNames.VaruhusPage} element={<Varuhus />} />
      <Route path={RouteNames.OrdrarPage} element={<Orderhistorik />} />
      <Route path={RouteNames.OrderPage} element={<Order />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)
