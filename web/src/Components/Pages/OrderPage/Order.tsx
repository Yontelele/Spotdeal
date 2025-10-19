import { DevicePhoneMobileIcon, CurrencyDollarIcon, DocumentTextIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import { getAbonnemangMonthlyCost } from "../../../Helpers/AbonnemangHelper"
import { useDebounce } from "../../../Hooks/useDebounce"
import { useParams } from "react-router-dom"
import { useOrder } from "../../../Hooks/useOrder"
import { Fragment } from "react"
import LoadingSpinner from "../../Common/LoadingSpinner"
import OrderSummary from "./OrderSummary"
import HeaderPage from "../../Common/HeaderPage"
import Layout from "../../Common/Layout"
import { getUserFullName } from "../../../Helpers/UserHelper"
import { ContractStatus } from "../../../Enums/ContractStatus"

export const Order = () => {
  const { id } = useParams<{ id: string }>()
  const orderId = Number(id)
  const { order } = useOrder(orderId)
  const showLoader = useDebounce(!order, 500)

  return (
    <Layout>
      {showLoader ? (
        <LoadingSpinner text="Hämtar order..." />
      ) : (
        order && (
          <Fragment>
            <HeaderPage titel={`Order #${order.id}`} />
            <OrderSummary order={order} />

            {order.contracts.map((contract, groupIndex) => {
              const isCancelled = contract.status === ContractStatus.Cancelled

              return (
                <div
                  key={groupIndex}
                  className="mb-6 bg-gray-800 shadow-md ring-1 ring-gray-300/5 sm:rounded-xl overflow-hidden border border-gray-700 transition-all duration-300"
                >
                  <header className="px-5 py-4 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full flex-shrink-0 bg-gray-800 p-1">
                        <img className="rounded-full object-contain" src={contract.operatorLogoUrl} />
                      </div>
                      <div>
                        <h2 className={`font-semibold text-white text-lg ${isCancelled && "line-through"}`}>{contract.name}</h2>
                        <div className="flex gap-2 mt-1">
                          {contract.phoneModel && (
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <DevicePhoneMobileIcon className="h-3 w-3" />
                              Hårdvara
                            </span>
                          )}

                          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CurrencyDollarIcon className="h-3 w-3" />
                            {getAbonnemangMonthlyCost(contract)} kr/mån
                          </span>
                          {contract.extraSurf && (
                            <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              +{contract.extraSurf} GB
                            </span>
                          )}
                          <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                            {contract.contractCodes.length} {contract.contractCodes.length > 1 ? "koder" : "kod"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </header>

                  {isCancelled && contract.cancelledByUser && (
                    <div className="mx-4 mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="flex items-center gap-1 min-w-0 flex-1">
                                <span className="text-red-300 text-sm">Makulerad av</span>
                                <span className="text-white text-sm font-medium truncate">{getUserFullName(contract.cancelledByUser)}</span>
                                <div className="flex items-center gap-2 text-red-300/70 text-xs ml-1 flex-shrink-0">
                                  <div className="w-px h-4 bg-red-400/30" />
                                  <time dateTime={new Date(contract.cancelledAt).toISOString()} className="whitespace-nowrap">
                                    {new Date(contract.cancelledAt).toLocaleDateString("sv-SE")} •{" "}
                                    {new Date(contract.cancelledAt).toLocaleTimeString("sv-SE", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </time>
                                </div>
                              </div>
                            </div>
                            {contract.cancellationReason && (
                              <p className="text-gray-300 text-sm italic pl-2 border-l-2 border-red-400/30">"{contract.cancellationReason}"</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3">
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full">
                        <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-700/50">
                          <tr>
                            <th className="p-2 whitespace-nowrap w-1/2">
                              <div className="font-semibold text-left">Beskrivning</div>
                            </th>
                            <th className="p-2 whitespace-nowrap w-1/3">
                              <div className="font-semibold text-left">Registreringskod</div>
                            </th>
                            <th className="p-2 whitespace-nowrap w-1/6">
                              <div className="font-semibold text-left">Belopp</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-700">
                          {contract.contractCodes.map((code, codeIndex) => (
                            <tr key={codeIndex}>
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 flex justify-center">
                                    {code.code.startsWith("IP") ? (
                                      <DevicePhoneMobileIcon className="w-5 h-5 text-blue-400" />
                                    ) : code.value ? (
                                      <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
                                    ) : (
                                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                                    )}
                                  </div>
                                  <span className={`font-medium text-white ${isCancelled && "line-through"}`}>{code.description}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center">
                                  <span className="font-mono font-medium text-violet-300 bg-violet-500/10 px-3 py-1 rounded-md">{code.code}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                {code.value ? <span className="font-medium text-green-400">{code.value} kr</span> : <span className="text-gray-400">-</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            })}
          </Fragment>
        )
      )}
    </Layout>
  )
}

export default Order
