import { Fragment, useEffect } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import { useAppContext } from "../../../../Context/AppContext"
import { useCartContext } from "../../../../Context/CartContext"
import { useRegistreringContext } from "../../../../Context/RegistreringContext"
import { Operatorer } from "../../../../Enums/Operatorer"
import { RouteNames } from "../../../../Enums/RouteNames"
import { toLowerCase } from "../../../../Helpers/StringHelper"
import { ToastConfig } from "../../../../Helpers/ToastHelper"
import { useContractCodes } from "../../../../Hooks/useContractCodes"
import { useLoading } from "../../../../Hooks/useLoading"
import { useOperator } from "../../../../Hooks/useOperator"
import { RegistreringManager } from "../../../../Managers/RegistreringManager"
import { ContractCodeListDto } from "../../../../Models/ContractCodeListDto"
import Layout from "../../../Common/Layout"
import HeaderCenter from "../../../Common/HeaderCentered"
import { LoadingSpinningIcon, SmallDotIcon } from "../../../Common/Icons"
import BindningstidButtons from "../Bredband/BindningstidButtons"
import { ContractType } from "../../../../Enums/ContractType"
import TvRadioGroup from "./TvRadioGroup"

export const RegistreraTV = () => {
  const { state, selectOperator } = useCartContext()
  const { selectedOperator, cart, selectedTvStreaming } = state
  const { abonnemangCart, phoneCart } = cart

  const { operator: operatorNameFromParams } = useParams<{ operator: string }>()
  const { operators } = useOperator()
  const { navigate } = useAppContext()
  const { setContractCodes } = useRegistreringContext()

  const mutation = useContractCodes()

  const showPending = useLoading(mutation.isPending)

  useEffect(() => {
    if (!operatorNameFromParams || !operators.length) return

    const foundOperator = operators.find((op) => toLowerCase(op.name) === operatorNameFromParams)

    if (foundOperator) {
      if (!selectedOperator || selectedOperator.id !== foundOperator.id) {
        if (foundOperator.id == Operatorer.TELE2 || foundOperator.id == Operatorer.TELIA) {
          selectOperator(foundOperator, ContractType.TV)
        }
      }
    } else navigate(RouteNames.RegistreraAbonnemangPage, { replace: true })
  }, [operatorNameFromParams, operators])

  function handleGetContractCodes() {
    if (!selectedTvStreaming) return

    const cartDto = RegistreringManager.createCartRequestDto(abonnemangCart, phoneCart, null, selectedTvStreaming.id)

    mutation.mutate(cartDto, {
      onError: (error) => toast.error(error.message || "Misslyckades att hämta koder. Försök igen.", ToastConfig),
      onSuccess: (contractCodes: ContractCodeListDto[]) => {
        if (!contractCodes || contractCodes.length === 0) {
          toast.error("Inga koder hittades. Kontrollera din order och försök igen.", ToastConfig)
          return
        }

        setContractCodes(contractCodes)
        navigate(RouteNames.RegistreringskoderPage)
      },
    })
  }

  return (
    <Layout>
      {selectedOperator && (
        <HeaderCenter titel="Registrera TV & Streaming" subtitle="Vänligen välj ett TV & Streaming paket">
          <Fragment>
            <BindningstidButtons operatorId={selectedOperator.id} contractType={ContractType.TV} />
            <TvRadioGroup selectedOperator={selectedOperator} />

            {selectedTvStreaming && (
              <div className="grid grid-cols-12 gap-6">
                <div className="flex flex-col col-span-full xl:col-span-9">
                  <ul role="list" className="divide-y divide-white/5 bg-gray-800 shadow-xs ring-1 ring-gray-300/5 sm:rounded-xl mt-24 border border-gray-700">
                    <div className="bg-gray-800 px-4 py-5 sm:px-6 rounded-t-xl">
                      <h3 className="font-semibold leading-6 text-white">Sammanställning av din order</h3>
                    </div>
                    <div className="relative flex items-center px-5 space-x-4 py-4">
                      <div className="min-w-0 flex-auto">
                        <div className="flex items-center gap-x-3">
                          <div className={`flex-none rounded-full p-1 text-green-400 bg-green-400/10`}>
                            <div className="h-2 w-2 rounded-full bg-current" />
                          </div>
                          <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                            <div className="flex gap-x-2">
                              <span className="truncate">{selectedTvStreaming.name}</span>
                            </div>
                          </h2>
                        </div>
                        <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                          <p className="truncate">TV & Streaming</p>
                          <SmallDotIcon />
                          <p className="whitespace-nowrap">{`${selectedTvStreaming.bindningstid} månaders bindningstid`}</p>
                          <SmallDotIcon />
                          <p className="truncate">{selectedTvStreaming.provision}</p>
                        </div>
                      </div>
                    </div>
                  </ul>
                </div>

                <div className="flex flex-col col-span-full xl:col-span-3">
                  <div className="overflow-hidden bg-gray-800 shadow-md ring-1 ring-gray-300/5 sm:rounded-lg mt-24 border border-gray-700">
                    <div className="divide-y divide-gray-700">
                      <div className="flex items-center px-6 py-4 space-x-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-400">Total månadskostnad</span>
                          <h2 className="text-2xl font-bold text-green-500">- kr/mån</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn bg-gray-100 text-gray-800 hover:bg-white disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed mt-3"
                    onClick={handleGetContractCodes}
                    disabled={mutation.isPending || !selectedTvStreaming}
                  >
                    {showPending ? (
                      <div className="flex items-center">
                        <LoadingSpinningIcon />
                        <span className="ml-2">Koder genereras...</span>
                      </div>
                    ) : (
                      <span>Hämta koder -&gt;</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </Fragment>
        </HeaderCenter>
      )}
    </Layout>
  )
}

export default RegistreraTV
