import { useCancelOrder, useOrderPage } from "../../../Hooks/useOrder"
import { getContractTypeString } from "../../../Helpers/OrderHelper"
import { MODAL_DELETE_ORDER } from "../../../Helpers/ModalHelper"
import { getUserFullName } from "../../../Helpers/UserHelper"
import { useAppContext } from "../../../Context/AppContext"
import { ToastConfig } from "../../../Helpers/ToastHelper"
import { OrderStatus } from "../../../Enums/OrderStatus"
import { useLoading } from "../../../Hooks/useLoading"
import { DeleteIcon, LoadingSpinningIcon } from "../../Common/Icons"
import { UserRole } from "../../../Enums/UserRole"
import { OrderDto } from "../../../Models/OrderDto"
import { useState } from "react"
import { useUser } from "../../../Hooks/useUser"
import { NavLink } from "react-router-dom"
import ModalDeleteOrder from "../../Modals/ModalDeleteOrder"
import HeaderPage from "../../Common/HeaderPage"
import UserAvatar from "../../Common/UserAvatar"
import Layout from "../../Common/Layout"
import toast from "react-hot-toast"

export const Orderhistorik = () => {
  const { handleShowModal, isModalOpen } = useAppContext()
  const { orders, isLoading, setPage } = useOrderPage()
  const { user } = useUser()
  const mutation = useCancelOrder()

  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null)
  const [cancelOrderReasonText, setCancelOrderReasonText] = useState<string>("")
  const [selectedContractsToCancel, setSelectedContractsToCancel] = useState<number[]>([])
  const showLoader = useLoading(isLoading)
  const showPending = useLoading(mutation.isPending)

  function handlePreviousPage() {
    if (orders && orders.hasPrevious) setPage((page) => page - 1)
  }

  function handleNextPage() {
    if (orders && orders.hasNext) setPage((page) => page + 1)
  }

  function handleShowDeleteOrderModal(order: OrderDto) {
    setSelectedContractsToCancel([])
    setCancelOrderReasonText("")
    setSelectedOrder(order)
    handleShowModal(MODAL_DELETE_ORDER)
  }

  async function handleDeleteOrder() {
    if (!selectedOrder) return

    mutation.mutate(
      {
        orderId: selectedOrder.id,
        request: {
          contractIds: selectedContractsToCancel,
          reason: cancelOrderReasonText,
        },
      },
      {
        onError: (error) => {
          toast.error(error.message || "Kunde inte makulera order. Försök igen.", ToastConfig)
          handleShowModal(MODAL_DELETE_ORDER)
        },
        onSuccess: () => {
          toast.success("Ordern har makulerats", ToastConfig)
          handleShowModal(MODAL_DELETE_ORDER)
        },
      }
    )
  }

  const statusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Confirmed:
        return "bg-green-500/20 text-green-700"
      case OrderStatus.Cancelled:
        return "bg-red-500/20 text-red-700"
      case OrderStatus.Combined:
        return "bg-yellow-500/20 text-yellow-700"
      default:
        return "bg-gray-700 text-gray-400"
    }
  }

  const status = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Confirmed:
        return "Bekräftad"
      case OrderStatus.Cancelled:
        return "Makulerad"
      case OrderStatus.Combined:
        return "Modifierad"
      default:
        return "Okänd"
    }
  }

  return (
    user &&
    orders && (
      <Layout>
        <HeaderPage titel="Orderhistorik" />
        <div className="col-span-full xl:col-span-12 bg-gray-800 shadow-xs rounded-xl">
          <header className="px-5 py-4 border-b border-gray-700/60">
            <h2 className="font-semibold text-gray-100">{user.store.name}</h2>
          </header>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-700/50">
                  <tr>
                    <th className="p-3 whitespace-nowrap">Order-ID</th>
                    <th className="p-3 whitespace-nowrap">Datum</th>
                    <th className="p-3 whitespace-nowrap">Säljare</th>
                    <th className="p-3 whitespace-nowrap">Operatör</th>
                    <th className="p-3 whitespace-nowrap">Fokus</th>
                    <th className="p-3 whitespace-nowrap">Status</th>
                    <th className="p-3 whitespace-nowrap">Antal</th>
                    <th className="p-3 whitespace-nowrap">Ordertyp</th>
                    <th className="p-3 whitespace-nowrap">Varuhus</th>
                    <th className="p-3 whitespace-nowrap">Makulera</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-700/60">
                  {orders.orders.map((order) => {
                    const isMakuleraButtonDisabled = (user.role === UserRole.Sales && !(order.userId === user.id)) || order.status === OrderStatus.Cancelled

                    return (
                      <tr key={order.id}>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserAvatar user={order.user} size="lg" />
                            <NavLink end to={`/order/${order.id}`} className="ml-3 font-medium text-sky-600">
                              #{order.id}
                            </NavLink>
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap text-center text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 whitespace-nowrap text-center text-white">{getUserFullName(order.user)}</td>
                        <td className="p-3 whitespace-nowrap text-center text-gray-300">{order.contracts[0].operatorName}</td>
                        <td className="p-3 whitespace-nowrap text-center text-gray-300">{order.contracts[0].isFokus ? "Ja" : "Nej"}</td>
                        <td className="p-3 whitespace-nowrap text-center text-gray-300">
                          <div className={`inline-flex font-medium rounded-full px-2.5 py-0.5 ${statusColor(order.status)}`}>{status(order.status)}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap text-center text-gray-300">{order.contracts.length} st</td>
                        <td className="p-3 whitespace-nowrap text-center text-gray-300">{getContractTypeString(order.contractType)}</td>
                        <td className="p-3 whitespace-nowrap text-center text-gray-300">{order.store.name}</td>
                        <td className="p-3 whitespace-nowrap text-center text-gray-300">
                          <button
                            className={`group p-2 rounded-full transition-all duration-300 ${isMakuleraButtonDisabled ? "" : "hover:bg-red-600"}`}
                            onClick={() => handleShowDeleteOrderModal(order)}
                            disabled={isMakuleraButtonDisabled}
                          >
                            <DeleteIcon className={`transition-all ${isMakuleraButtonDisabled ? "fill-gray-700" : "fill-red-600 group-hover:fill-white"}`} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between">
            <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Visar{" "}
              <span className="font-sm text-gray-100">
                {orders.hasPrevious ? orders.pageNumber * 10 - 9 : 1}-
                {orders.hasNext ? orders.pageNumber * 10 : orders.pageNumber * 10 + orders.orders.length - 10}
              </span>{" "}
              av <span className="font-sm text-gray-100">{orders.totalCount}</span> ordrar
            </span>
            <div className="flex items-center">
              {showLoader && <LoadingSpinningIcon />}
              <ul className="inline-flex text-sm ml-4.5">
                <li>
                  <button
                    className="btn bg-gray-800 !border !border-gray-700 text-gray-300 hover:!border-gray-600 disabled:text-gray-600 disabled:hover:border-gray-700! disabled:cursor-not-allowed"
                    onClick={handlePreviousPage}
                    disabled={!orders.hasPrevious || showLoader}
                  >
                    &lt;- Förgående
                  </button>
                </li>
                <li>
                  <button
                    className="btn bg-gray-800 !border !border-gray-700 text-gray-300 ml-3 hover:!border-gray-600 disabled:text-gray-600 disabled:hover:border-gray-700! disabled:cursor-not-allowed"
                    onClick={handleNextPage}
                    disabled={!orders.hasNext || showLoader}
                  >
                    Nästa -&gt;
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {selectedOrder && (
          <ModalDeleteOrder
            order={selectedOrder}
            cancelOrderReasonText={cancelOrderReasonText}
            setCancelOrderReasonText={setCancelOrderReasonText}
            selectedContractsToCancel={selectedContractsToCancel}
            setSelectedContractsToCancel={setSelectedContractsToCancel}
            open={isModalOpen(MODAL_DELETE_ORDER)}
            close={() => handleShowModal(MODAL_DELETE_ORDER)}
            onDelete={handleDeleteOrder}
            isPending={showPending}
          />
        )}
      </Layout>
    )
  )
}

export default Orderhistorik
