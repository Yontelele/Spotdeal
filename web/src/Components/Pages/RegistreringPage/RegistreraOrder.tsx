import { MODAL_DELETE_ABONNEMANG } from "../../../Helpers/ModalHelper"
import { LoadingSpinningIcon, SmallDotIcon } from "../../Common/Icons"
import { useRegistreringContext } from "../../../Context/RegistreringContext"
import { RegistreringManager } from "../../../Managers/RegistreringManager"
import { ContractCodeListDto } from "../../../Models/ContractCodeListDto"
import { Fragment, useEffect } from "react"
import { useContractCodes } from "../../../Hooks/useContractCodes"
import { AbonnemangInCart } from "../../../Models/CartDto"
import { usePhoneContext } from "../../../Context/PhoneContext"
import { useCartContext } from "../../../Context/CartContext"
import { useAppContext } from "../../../Context/AppContext"
import { CartManager } from "../../../Managers/CartManager"
import { toLowerCase } from "../../../Helpers/StringHelper"
import { ToastConfig } from "../../../Helpers/ToastHelper"
import { useOperator } from "../../../Hooks/useOperator"
import { useParams } from "react-router-dom"
import { MenuItem } from "@headlessui/react"
import AbonnemangTypeButtons from "./AbonnemangTypeButtons"
import AbonnemangRadioGroup from "./AbonnemangRadioGroup"
import HeaderCenter from "../../Common/HeaderCentered"
import ThreeDotMenu from "../../Common/ThreeDotMenu"
import ModalDelete from "../../Modals/ModalDelete"
import Tooltip from "../../Common/Tooltip"
import Layout from "../../Common/Layout"
import toast from "react-hot-toast"
import { useLoading } from "../../../Hooks/useLoading"
import { RouteNames } from "../../../Enums/RouteNames"
import { ContractType } from "../../../Enums/ContractType"

export const RegistreraOrder = () => {
  const { state, selectOperator, selectAbonnemang, removeAbonnemangFromCart, addAbonnemangToCart, removePhoneFromCart } = useCartContext()
  const { selectedOperator, cart, selectedHuvudAbonnemang, selectedAbonnemang } = state
  const { abonnemangCart, phoneCart } = cart
  const { editPhone, openPhoneModal } = usePhoneContext()

  const { operator: operatorNameFromParams } = useParams<{ operator: string }>()
  const { operators } = useOperator()
  const { navigate, handleShowModal, isModalOpen } = useAppContext()
  const { setContractCodes } = useRegistreringContext()

  const mutation = useContractCodes()
  const isCartEmpty = abonnemangCart.length === 0
  const totalPriceInCart = CartManager.calculateOrdinarieMonthlyAbonnemangPrice(abonnemangCart) + CartManager.calculateTotalMonthlyPhonePrice(phoneCart)
  const abonnementDiscount = CartManager.calculateMonthlyAbonnemangDiscount(abonnemangCart)
  const price = totalPriceInCart - abonnementDiscount

  const showPending = useLoading(mutation.isPending)

  useEffect(() => {
    if (!operatorNameFromParams || !operators.length) return

    const foundOperator = operators.find((op) => toLowerCase(op.name) === operatorNameFromParams)

    if (foundOperator) {
      if (!selectedOperator || selectedOperator.id !== foundOperator.id) {
        selectOperator(foundOperator, ContractType.Abonnemang)
      }
    } else navigate(RouteNames.RegistreraAbonnemangPage, { replace: true })
  }, [operatorNameFromParams, operators])

  function handleRemoveAbonnemangFromCartWithButton(): void {
    const abonnemangToRemove = abonnemangCart[abonnemangCart.length - 1]
    if (!abonnemangToRemove) return

    if (CartManager.isAbonnemangConnectedToPhone(abonnemangToRemove, phoneCart)) {
      selectAbonnemang(abonnemangToRemove)
      handleShowModal(MODAL_DELETE_ABONNEMANG)
    } else removeAbonnemangFromCart(abonnemangToRemove)
  }

  function handleRemoveAbonnemangFromCartWithMenu(abonnemangToRemove: AbonnemangInCart): void {
    if (CartManager.isAbonnemangConnectedToPhone(abonnemangToRemove, phoneCart)) {
      selectAbonnemang(abonnemangToRemove)
      handleShowModal(MODAL_DELETE_ABONNEMANG)
    } else removeAbonnemangFromCart(abonnemangToRemove)
  }

  function handleGetContractCodes() {
    if (isCartEmpty) return

    const cartDto = RegistreringManager.createCartRequestDto(abonnemangCart, phoneCart, null, null)

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
        <HeaderCenter titel="Registrera ett nytt abonnemang" subtitle="Vänligen välj abonnemangsplan och eventuell hårdvara">
          <Fragment>
            <AbonnemangTypeButtons operatorId={selectedOperator.id} />
            <AbonnemangRadioGroup
              selectedOperator={selectedOperator}
              removeAbonnemangFromCartWithButton={handleRemoveAbonnemangFromCartWithButton}
              addAbonnemangToCartWithButton={addAbonnemangToCart}
            />

            {selectedHuvudAbonnemang && (
              <div className="grid grid-cols-12 gap-6">
                <div className="flex flex-col col-span-full xl:col-span-9">
                  <ul role="list" className="divide-y divide-white/5 bg-gray-800 shadow-xs ring-1 ring-gray-300/5 sm:rounded-xl mt-24 border border-gray-700">
                    <div className="bg-gray-800 px-4 py-5 sm:px-6 rounded-t-xl">
                      <h3 className="font-semibold leading-6 text-white">Sammanställning av din order</h3>
                    </div>
                    {abonnemangCart.map((abonnemangInCart) => (
                      <li key={abonnemangInCart.uniqueId} className="relative flex items-center px-5 space-x-4 py-4">
                        <div className="min-w-0 flex-auto">
                          <div className="flex items-center gap-x-3">
                            <div
                              className={`flex-none rounded-full p-1 ${
                                abonnemangInCart.isFokus ? "text-green-400 bg-green-400/10" : "text-gray-500 bg-gray-100/10"
                              }`}
                            >
                              <div className="h-2 w-2 rounded-full bg-current" />
                            </div>
                            <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                              <div className="flex gap-x-2">
                                <span className="truncate">{abonnemangInCart.name}</span>
                                <span className="text-gray-400">/</span>
                                <span className="whitespace-nowrap">{abonnemangInCart.monthlyPrice - (abonnemangInCart.monthlyDiscount ?? 0)} KR</span>
                                {abonnemangInCart.extraSurf ? (
                                  <span className="inline-flex items-center rounded-full bg-pink-400/10 px-2 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-400/30 ml-1">
                                    +{abonnemangInCart.extraSurf} GB
                                  </span>
                                ) : (
                                  ""
                                )}
                                {CartManager.isAbonnemangConnectedToPhone(abonnemangInCart, phoneCart) ? (
                                  <div className="ml-2.5">
                                    <div className="flex items-center space-x-2">
                                      <Tooltip>
                                        <div className="text-xs whitespace-nowrap">
                                          {CartManager.phoneThatIsConnectedToTheAbonnemang(abonnemangInCart, phoneCart)?.selectedPhone.brand}{" "}
                                          {CartManager.phoneThatIsConnectedToTheAbonnemang(abonnemangInCart, phoneCart)?.selectedPhone.model}{" "}
                                          {CartManager.phoneThatIsConnectedToTheAbonnemang(abonnemangInCart, phoneCart)?.selectedPhone.storage}{" "}
                                          {CartManager.phoneThatIsConnectedToTheAbonnemang(abonnemangInCart, phoneCart)?.selectedPhone.color}
                                        </div>
                                      </Tooltip>
                                      <div className="text-sm font-medium text-gray-400">Hårdvara kopplad</div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </h2>
                          </div>
                          <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                            <p className="truncate">{abonnemangInCart.isFokus ? "Fokus abonnemang" : "Inte fokus abonnemang"}</p>
                            <SmallDotIcon />
                            <p className="whitespace-nowrap">{`${abonnemangInCart.bindningstid} månaders bindningstid`}</p>
                            <SmallDotIcon />
                            <p className="truncate">{abonnemangInCart.provision}</p>
                          </div>
                        </div>
                        {abonnemangInCart.monthlyDiscount ? (
                          abonnemangInCart.monthlyDiscount >= 50 ? (
                            <div className="rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset text-purple-400 bg-purple-400/10 ring-purple-400/30">
                              {`-${abonnemangInCart.monthlyDiscount} kr/mån i ${abonnemangInCart.monthlyDiscountDuration}mån`}
                            </div>
                          ) : (
                            <div className="rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset text-green-400 bg-green-400/10 ring-green-400/30">
                              {`-${abonnemangInCart.monthlyDiscount} kr/mån i ${abonnemangInCart.monthlyDiscountDuration}mån`}
                            </div>
                          )
                        ) : (
                          ""
                        )}

                        <ThreeDotMenu>
                          <MenuItem>
                            <button
                              disabled={CartManager.isAbonnemangConnectedToPhone(abonnemangInCart, phoneCart)}
                              className={`font-medium text-sm flex py-1 px-3  ${
                                CartManager.isAbonnemangConnectedToPhone(abonnemangInCart, phoneCart)
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-300 hover:text-gray-200"
                              }`}
                              onClick={() => openPhoneModal(abonnemangInCart)}
                            >
                              + Lägg till hårdvara
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3"
                              onClick={() => handleRemoveAbonnemangFromCartWithMenu(abonnemangInCart)}
                            >
                              Ta bort abonnemang
                            </button>
                          </MenuItem>
                        </ThreeDotMenu>
                      </li>
                    ))}
                    {phoneCart.map((phoneInCart) => (
                      <li className="relative flex items-center px-5 space-x-4 py-4" key={phoneInCart.uniqueId}>
                        <div className="min-w-0 flex-auto">
                          <div className="flex items-center gap-x-3">
                            <img src={phoneInCart.selectedPhone.img} className="h-8 w-6 rounded-xs bg-gray-800" />
                            <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                              <div className="flex gap-x-2">
                                <span className="truncate">
                                  {phoneInCart.selectedPhone.brand} {phoneInCart.selectedPhone.model} {phoneInCart.selectedPhone.storage}
                                </span>
                                <span className="text-gray-400">/</span>
                                <span className="whitespace-nowrap">
                                  {phoneInCart.isDelbetalning ? phoneInCart.phonePricePerMonth : phoneInCart.phonePrice} KR
                                </span>
                              </div>
                            </h2>
                          </div>
                          <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                            <p className="truncate">{phoneInCart.selectedPhone.color}</p>
                            <SmallDotIcon />
                            <p className="whitespace-nowrap">{phoneInCart.isDelbetalning ? "24 månaders delbetalning" : "Betalas i kassan"}</p>
                          </div>
                        </div>

                        <ThreeDotMenu>
                          <MenuItem>
                            <button className="font-medium text-sm text-gray-300 hover:text-gray-200 flex py-1 px-3" onClick={() => editPhone(phoneInCart)}>
                              Redigera hårdvara
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3"
                              onClick={() => removePhoneFromCart(phoneInCart)}
                            >
                              Ta bort hårdvara
                            </button>
                          </MenuItem>
                        </ThreeDotMenu>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col col-span-full xl:col-span-3">
                  <div className="overflow-hidden bg-gray-800 shadow-md ring-1 ring-gray-300/5 sm:rounded-lg mt-24 border border-gray-700">
                    <div className="bg-gray-800 px-6 py-5 border-b border-gray-700">
                      <h3 className="font-bold text-lg leading-7 text-white">Prisöversikt</h3>
                    </div>

                    <div className="divide-y divide-gray-700">
                      <div className="flex items-center px-6 py-4 space-x-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-400">Ordinariekostnad</span>
                          <h2 className="text-lg font-semibold text-white">{totalPriceInCart} kr/mån</h2>
                        </div>
                      </div>

                      <div className="flex items-center px-6 py-4 space-x-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-400">Rabatt</span>
                          <h2 className="text-lg font-semibold text-red-500">-{abonnementDiscount} kr/mån</h2>
                        </div>
                      </div>

                      <div className="flex items-center px-6 py-4 space-x-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-400">Total månadskostnad</span>
                          <h2 className="text-2xl font-bold text-green-500">{price} kr/mån</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn bg-gray-100 text-gray-800 hover:bg-white disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed mt-3"
                    onClick={handleGetContractCodes}
                    disabled={mutation.isPending || isCartEmpty}
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

      {selectedAbonnemang && (
        <ModalDelete
          modalTitel="Ta bort abonnemang?"
          modalDescriptionText={
            <Fragment>
              Är du säker på att du vill ta bort detta abonnemang? <br />
              Hårdvaran kopplat till detta abonnemang kommer också att tas bort. Denna åtgärd kan inte ångras.
            </Fragment>
          }
          modalDeleteButtonText="Ja, ta bort abonnemang"
          open={isModalOpen(MODAL_DELETE_ABONNEMANG)}
          close={() => handleShowModal(MODAL_DELETE_ABONNEMANG)}
          onDelete={() => {
            handleShowModal(MODAL_DELETE_ABONNEMANG)
            removeAbonnemangFromCart(selectedAbonnemang)
          }}
        />
      )}
    </Layout>
  )
}

export default RegistreraOrder
