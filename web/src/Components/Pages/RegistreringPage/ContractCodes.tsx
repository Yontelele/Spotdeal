import { CheckCircleIcon, ClipboardDocumentIcon, CurrencyDollarIcon, DevicePhoneMobileIcon, DocumentTextIcon } from "@heroicons/react/24/solid"
import Layout from "../../Common/Layout"
import { LoadingSpinningIcon } from "../../Common/Icons"
import toast from "react-hot-toast"
import { ToastConfig } from "../../../Helpers/ToastHelper"
import { useEffect, useState } from "react"
import { useAppContext } from "../../../Context/AppContext"
import { useRegistreringContext } from "../../../Context/RegistreringContext"
import { useCreateOrder } from "../../../Hooks/useOrder"
import { useCartContext } from "../../../Context/CartContext"
import { RegistreringManager } from "../../../Managers/RegistreringManager"
import { MODAL_ORDER_CONFIRMATION } from "../../../Helpers/ModalHelper"
import ModalOrderConfirmation from "../../Modals/ModalOrderConfirmation"
import { motion, AnimatePresence } from "framer-motion"
import { OrderDto } from "../../../Models/OrderDto"
import { useLoading } from "../../../Hooks/useLoading"
import { getAbonnemangMonthlyCost } from "../../../Helpers/AbonnemangHelper"

export const ContractCodes = () => {
  const { navigate, handleShowModal } = useAppContext()
  const { contractCodes } = useRegistreringContext()
  const { state } = useCartContext()
  const { cart, selectedBredband, selectedTvStreaming } = state
  const { abonnemangCart, phoneCart } = cart
  const mutation = useCreateOrder()
  const showPending = useLoading(mutation.isPending)

  const [copiedCodes, setCopiedCodes] = useState<Set<string>>(new Set())
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(() => new Set(contractCodes.map((_, i) => i)))
  const [isRegistreraOrderButtonDisabled, setIsRegistreraOrderButtonDisabled] = useState(false)
  const [skipInitialAnimation, setSkipInitialAnimation] = useState(true)
  const [orderId, setOrderId] = useState<number | null>(null)

  const handleCopy = async (code: string, groupIndex: number, codeIndex: number) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCodes((prev) => new Set(prev).add(`${groupIndex}-${codeIndex}`))
      toast.success("Kopierad!", ToastConfig)
    } catch (error) {
      toast.error("Kunde inte kopiera kod", ToastConfig)
    }
  }

  const toggleGroup = (index: number) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else newSet.add(index)
      return newSet
    })
  }

  function handleCreateNewOrder() {
    setIsRegistreraOrderButtonDisabled(true)
    const cartDto = RegistreringManager.createCartRequestDto(
      abonnemangCart,
      phoneCart,
      selectedBredband ? selectedBredband.id : null,
      selectedTvStreaming ? selectedTvStreaming.id : null
    )

    mutation.mutate(cartDto, {
      onError: (error) => {
        toast.error(error.message || "Kunde inte skapa order. Försök igen.", ToastConfig)
        setIsRegistreraOrderButtonDisabled(false)
      },
      onSuccess: (createdOrder: OrderDto) => {
        handleShowModal(MODAL_ORDER_CONFIRMATION)
        setOrderId(createdOrder.id)
      },
    })
  }

  function navigateBack() {
    navigate(-1)
  }

  useEffect(() => {
    setSkipInitialAnimation(false)
  }, [])

  if (!contractCodes || contractCodes.length === 0) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Registreringskoder</h1>
          <div className="bg-gray-800 shadow-md ring-1 ring-gray-300/5 sm:rounded-xl p-8 text-center border border-gray-700">
            <p className="text-gray-300 mb-4">Inga registreringskoder hittades.</p>
            <button
              className="bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={navigateBack}
            >
              Tillbaka till varukorgen
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Registreringskoder</h1>

        {contractCodes.map((group, groupIndex) => {
          const abonnemangInCode = abonnemangCart.find((a) => a.id === group.abonnemangId)
          const hasGenereratedCode = abonnemangInCode || selectedBredband || selectedTvStreaming
          const isExpanded = expandedGroups.has(groupIndex)
          const totalCodesInGroup = group.codes.length
          const copiedCodesInGroup = group.codes.filter((_, codeIndex) => copiedCodes.has(`${groupIndex}-${codeIndex}`)).length
          const groupProgress = totalCodesInGroup > 0 ? (copiedCodesInGroup / totalCodesInGroup) * 100 : 0

          return (
            hasGenereratedCode && (
              <div
                key={groupIndex}
                className="mb-6 bg-gray-800 shadow-md ring-1 ring-gray-300/5 sm:rounded-xl overflow-hidden border border-gray-700 transition-all duration-300"
              >
                <header
                  className="px-5 py-4 border-b border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-700/10 transition-colors duration-200"
                  onClick={() => toggleGroup(groupIndex)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full flex-shrink-0 bg-gray-800 p-1">
                      <img className="rounded-full object-contain" src={hasGenereratedCode.operator.logoUrl} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white text-lg">{hasGenereratedCode.name}</h2>
                      {abonnemangInCode && (
                        <div className="flex gap-2 mt-1">
                          {group.codes.some((c) => c.code.startsWith("IP")) && (
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <DevicePhoneMobileIcon className="h-3 w-3" />
                              Hårdvara
                            </span>
                          )}
                          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CurrencyDollarIcon className="h-3 w-3" />
                            {getAbonnemangMonthlyCost(abonnemangInCode)} kr/mån
                          </span>
                          {abonnemangInCode.extraSurf && (
                            <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              +{abonnemangInCode.extraSurf} GB
                            </span>
                          )}
                          <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                            {group.codes.length} {group.codes.length > 1 ? "koder" : "kod"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${copiedCodesInGroup === totalCodesInGroup ? "bg-green-500" : "bg-violet-600"}`}
                            style={{ width: `${groupProgress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">
                          {copiedCodesInGroup}/{totalCodesInGroup}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center w-6 h-6 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-gray-400 transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </header>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={skipInitialAnimation ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-3">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full">
                            <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-700/50">
                              <tr>
                                <th className="p-2 whitespace-nowrap">
                                  <div className="font-semibold text-left">Beskrivning</div>
                                </th>
                                <th className="p-2 whitespace-nowrap w-1/4">
                                  <div className="font-semibold text-left ">Registreringskod</div>
                                </th>
                                <th className="p-2 whitespace-nowrap w-1/6">
                                  <div className="font-semibold text-left">Belopp</div>
                                </th>
                                <th className="p-2 whitespace-nowrap w-1/6">
                                  <div className="font-semibold text-center">Status</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-700">
                              {group.codes.map((code, codeIndex) => {
                                const uniqueKey = `${groupIndex}-${codeIndex}`
                                const isCopied = copiedCodes.has(uniqueKey)

                                return (
                                  <tr
                                    key={codeIndex}
                                    className={`hover:bg-gray-700/10 transition-colors group cursor-pointer ${
                                      isCopied ? "bg-green-900/10 hover:bg-green-900/20" : ""
                                    }`}
                                    onClick={() => handleCopy(code.code, groupIndex, codeIndex)}
                                  >
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
                                        <span className="font-medium text-white">{code.description}</span>
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      <div className="flex items-center">
                                        <span className="font-mono font-medium text-violet-300 bg-violet-500/10 px-3 py-1 rounded-md">{code.code}</span>
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      {code.value ? (
                                        <span className="font-medium text-green-400">{code.value} kr</span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                    <td className="text-center p-2">
                                      <div className="flex items-center justify-center">
                                        {isCopied ? (
                                          <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            Kopierad
                                          </span>
                                        ) : (
                                          <button className="p-2 rounded-lg transition-all duration-200 bg-violet-600/20 hover:bg-violet-600/40 group-hover:bg-violet-600/20 text-violet-400 hover:text-white group-hover:text-violet-200 flex items-center gap-1">
                                            <ClipboardDocumentIcon className="h-4 w-4" />
                                            <span className="text-xs">Kopiera</span>
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          )
        })}

        <div className="-mt-1 flex justify-between">
          <button
            className="btn bg-gray-800 text-gray-300 border-gray-700/60 hover:border-gray-600/60 disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"
            onClick={navigateBack}
            disabled={isRegistreraOrderButtonDisabled}
          >
            &lt;- Redigera abonnemang & hårdvara
          </button>

          <button
            className="btn bg-gray-100 text-gray-800 hover:bg-white disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"
            onClick={handleCreateNewOrder}
            disabled={isRegistreraOrderButtonDisabled}
          >
            {showPending ? (
              <div className="flex items-center">
                <LoadingSpinningIcon />
                <span className="ml-2">Order behandlas...</span>
              </div>
            ) : (
              <span>Registrera order</span>
            )}
          </button>
        </div>
      </div>
      <ModalOrderConfirmation orderId={orderId} />
    </Layout>
  )
}

export default ContractCodes
