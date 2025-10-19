import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import { OrderDto } from "../../Models/OrderDto"
import { Dispatch, Fragment, SetStateAction } from "react"
import { LoadingSpinningIcon, SmallDotIcon } from "../Common/Icons"
import { ContractStatus } from "../../Enums/ContractStatus"

type Props = {
  order: OrderDto
  cancelOrderReasonText: string
  setCancelOrderReasonText: Dispatch<SetStateAction<string>>
  selectedContractsToCancel: number[]
  setSelectedContractsToCancel: Dispatch<SetStateAction<number[]>>
  open: boolean
  close: () => void
  onDelete: () => void
  isPending?: boolean
}

export const ModalDeleteOrder = ({
  order,
  cancelOrderReasonText,
  setCancelOrderReasonText,
  selectedContractsToCancel,
  setSelectedContractsToCancel,
  open,
  close,
  onDelete,
  isPending = false,
}: Props) => {
  const contracts = order.contracts.filter((c) => c.status === ContractStatus.Confirmed)

  function toggleContract(contractId: number): void {
    if (selectedContractsToCancel.includes(contractId)) setSelectedContractsToCancel((prev) => prev.filter((id) => id !== contractId))
    else setSelectedContractsToCancel((prev) => [...prev, contractId])
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" onClose={close} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-900/70 backdrop-blur-md" />
        </TransitionChild>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-end justify-center p-4 text-left sm:items-center">
            <TransitionChild
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="w-full max-w-lg relative transform overflow-hidden rounded-lg bg-gray-800 border border-gray-700/60 text-left shadow-xl">
                <div className="bg-gray-800 px-4 pb-2 pt-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-700 sm:mx-0 sm:h-11 sm:w-11 sm:mt-3">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-left ml-5">
                      <DialogTitle className="font-semibold text-gray-100 text-lg">{`Makulera order #${order.id}?`}</DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-400">
                          Vänligen markera de kontrakt som ska makuleras och ange en orsak. Denna åtgärd är permanent och kan inte ångras.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2 ml-0.25">
                        Vad vill kunden ångra? <span className="text-red-500">*</span>
                      </h3>
                      <div className="max-h-76 overflow-auto !scrollbar-thin !scrollbar-thumb-gray-400/70 !scrollbar-track-gray-800 !scrollbar-thumb-rounded-full !scrollbar-track-rounded-lg space-y-3">
                        {contracts.map((contract) => {
                          const monthlyPrice = contract.monthlyPrice ? contract.monthlyPrice - (contract.monthlyDiscount || 0) : null

                          return (
                            <div
                              key={contract.id}
                              onClick={() => {
                                if (!isPending) toggleContract(contract.id)
                              }}
                              role={isPending ? undefined : "button"}
                              className={`relative p-4 pt-2 pb-2 transition-colors duration-200 border border-gray-600/60 rounded-lg hover:border-gray-600 ${
                                isPending ? "cursor-not-allowed" : "cursor-pointer"
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="mt-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedContractsToCancel.includes(contract.id)}
                                    disabled={isPending}
                                    onChange={() => toggleContract(contract.id)}
                                    className="form-checkbox disabled:cursor-not-allowed cursor-pointer"
                                  />
                                </div>

                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <img src={contract.operatorLogoUrl} className="w-8 h-8 object-contain flex-shrink-0" />

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-medium text-gray-100 truncate">{contract.name}</h4>
                                    </div>

                                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs">
                                      {monthlyPrice && (
                                        <>
                                          <span className="font-medium">{monthlyPrice} kr/mån</span>
                                          <SmallDotIcon />
                                        </>
                                      )}
                                      <span>{contract.bindningstid} månader bindningstid</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1.5 ml-0.5">
                        Ange orsak för makulering: <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className="form-textarea w-full"
                        rows={3}
                        required
                        onChange={(e) => setCancelOrderReasonText(e.target.value)}
                        value={cancelOrderReasonText}
                        disabled={isPending}
                        maxLength={400}
                        placeholder="Beskriv varför denna order ska makuleras..."
                      />
                      <p className="mt-1 text-right text-xs text-gray-400">{cancelOrderReasonText.length}/400 tecken</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end space-x-2 px-4 pb-3 pt-1">
                  <button onClick={close} className="btn-sm border-gray-700/60 hover:border-gray-600 text-gray-300" disabled={isPending}>
                    Avbryt
                  </button>
                  <button
                    onClick={() => onDelete()}
                    className="btn-sm bg-red-500 border-red-500! hover:bg-red-600 text-white disabled:border-gray-700 disabled:border-gray-700/60! disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"
                    disabled={cancelOrderReasonText.length === 0 || isPending || selectedContractsToCancel.length === 0}
                  >
                    {isPending ? (
                      <div className="flex items-center">
                        <LoadingSpinningIcon />
                        <span className="ml-2">Order makuleras...</span>
                      </div>
                    ) : (
                      <span>Ja, makulera order</span>
                    )}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalDeleteOrder
