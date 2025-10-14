import { getUserFullName, getUserInitials } from "../../../Helpers/UserHelper"
import { CalendarIcon, CurrencyDollarIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid"
import { OrderDto } from "../../../Models/OrderDto"

interface Props {
  order: OrderDto
}

const OrderSummary = ({ order }: Props) => {
  const totalCommission = order.contracts.reduce((sum, contract) => sum + contract.provision, 0)
  const createdDate = new Date(order.createdAt)

  const formattedDate = createdDate.toLocaleDateString("sv-SE")
  const formattedTime = createdDate.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="mb-6 bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-700">
      <div className="p-5">
        <div className="flex justify-between flex-wrap">
          <div className="flex items-start gap-3">
            <div className="bg-gray-700/50 h-11 w-11 rounded-full flex items-center justify-center font-semibold text-gray-300">
              {getUserInitials(order.user)}
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.25">Skapad av</p>
              <p className="text-white font-medium">{getUserFullName(order.user)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-gray-700/50 h-11 w-11 rounded-full flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.25">Datum & tid</p>
              <div className="flex items-center gap-2">
                <p className="text-white font-medium">{formattedDate}</p>
                <span className="text-gray-500">•</span>
                <p className="text-gray-300">{formattedTime}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-gray-700/50 h-11 w-11 rounded-full flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.25">Provision</p>
              <p className="text-white font-medium">{totalCommission} kr</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-gray-700/50 h-11 w-11 rounded-full flex items-center justify-center">
              <BuildingStorefrontIcon className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.25">Varuhus</p>
              <p className="text-white font-medium">{order.store.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
