import { Dialog, DialogBackdrop, DialogPanel, Label, Radio, RadioGroup, Transition, TransitionChild } from "@headlessui/react"
import { CheckCircleIcon, StarIcon } from "@heroicons/react/20/solid"
import { Operatorer } from "../../Enums/Operatorer"
import { MODAL_ADD_PHONE_TO_CART } from "../../Helpers/ModalHelper"
import { CloseModalIcon, SearchIconBig, SearchIconSmall } from "../Common/Icons"
import { useSpotDeal } from "../../Hooks/useSpotDeal"
import { usePhoneContext } from "../../Context/PhoneContext"
import { PhoneManager } from "../../Managers/PhoneManager"
import { SpotdealManager } from "../../Managers/SpotdealManager"
import { FormEvent, Fragment } from "react"
import { useAppContext } from "../../Context/AppContext"
import { PaymentOption } from "../../Enums/PaymentOption"
import { useCartContext } from "../../Context/CartContext"
import { useDebounce } from "../../Hooks/useDebounce"
import { motion, AnimatePresence } from "framer-motion"
import { PhoneDto } from "../../Models/PhoneDto"
import { staggerItems, listItem, fadeIn, fadeInUp } from "../../Helpers/MotionHelper"

export const ModalAddPhoneToCart = () => {
  const { spotdeals } = useSpotDeal()
  const { isModalOpen } = useAppContext()

  const { state: cartState } = useCartContext()
  const { selectedAbonnemang } = cartState

  const {
    state,
    setPhoneSearch,
    selectPhone,
    setPhoneDiscount,
    selectPaymentOption,
    findPhoneSearchResults,
    findMatchingPhones,
    operationAddPhoneToCart,
    setStepInPhoneModal,
    closePhoneModal,
    setDirectionInPhoneModal,
  } = usePhoneContext()
  const { selectedPhone, phoneSearch, paymentOption, phoneDiscount, selectedPhoneId, selectedStepInPhoneModal, selectedDirectionInPhoneModal } = state

  const debouncedPhoneSearch = useDebounce(phoneSearch, 200)
  const searchResults = findPhoneSearchResults(debouncedPhoneSearch)
  const matchingPhones = findMatchingPhones(selectedPhone)

  const paymentOptions = [
    {
      value: PaymentOption.DELBETALNING,
      label: "Delbetalning",
      description: "Betala månadsvis",
    },
    {
      value: PaymentOption.BETALA_DIREKT,
      label: "Direktbetalning",
      description: "Betala hela summan",
    },
  ]

  function calculateMonthlyPrice() {
    if (!selectedPhone) return 0

    return selectedAbonnemang?.operatorId === Operatorer.TELIA || selectedAbonnemang?.operatorId === Operatorer.HALEBOP
      ? PhoneManager.calculateTeliaMonthlyPriceOnPhone(selectedPhone, phoneDiscount)
      : PhoneManager.calculateMonthlyPriceOnPhone(selectedPhone, phoneDiscount)
  }

  function calculateTotalPrice() {
    if (!selectedPhone) return 0
    const totalPrice = selectedPhone.price - phoneDiscount
    return totalPrice > 0 ? totalPrice : 0
  }

  function gridPhoneColumns() {
    const count = matchingPhones.length
    if (count === 1) return "grid-cols-1"
    if (count === 2) return "grid-cols-2"
    if (count === 3) return "grid-cols-3"
    if (count === 4) return "grid-cols-4"
    if (count === 5) return "grid-cols-5"
    if (count === 6) return "grid-cols-6"
    return "grid-cols-7"
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()

    if (selectedAbonnemang && selectedPhone) {
      const success = operationAddPhoneToCart(selectedAbonnemang)
      if (success) handleCloseModal()
    }
  }

  function goToNextStep() {
    setDirectionInPhoneModal("forward")
    setTimeout(() => {
      setStepInPhoneModal(3)
    }, 50)
  }

  function handlePhoneSelect(phone: PhoneDto) {
    setDirectionInPhoneModal("forward")
    setTimeout(() => {
      setStepInPhoneModal(2)
      selectPhone(phone)
    }, 50)
  }

  function goToPreviousStep() {
    setDirectionInPhoneModal("backward")
    setTimeout(() => {
      setStepInPhoneModal(2)
    }, 50)
  }

  function handleResetPhoneSelection() {
    setDirectionInPhoneModal("backward")
    setTimeout(() => {
      selectPhone(null)
      setStepInPhoneModal(1)
    }, 50)
  }

  function handleCloseModal() {
    setDirectionInPhoneModal(null)
    setTimeout(() => {
      closePhoneModal()
    }, 10)
  }

  const ProgressSteps = () => (
    <div className="px-6 pt-4">
      <div className="flex items-center">
        <div className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${selectedStepInPhoneModal >= 1 ? "bg-violet-600" : "bg-gray-700"} text-white`}
          >
            1
          </div>
          <p className={`ml-2 text-sm ${selectedStepInPhoneModal >= 1 ? "text-white" : "text-gray-500"}`}>Välj modell</p>
        </div>
        <div className={`flex-grow mx-2 h-0.5 ${selectedStepInPhoneModal >= 2 ? "bg-violet-600" : "bg-gray-700"}`}></div>
        <div className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${selectedStepInPhoneModal >= 2 ? "bg-violet-600" : "bg-gray-700"} text-white`}
          >
            2
          </div>
          <p className={`ml-2 text-sm ${selectedStepInPhoneModal >= 2 ? "text-white" : "text-gray-500"}`}>Välj färg</p>
        </div>
        <div className={`flex-grow mx-2 h-0.5 ${selectedStepInPhoneModal >= 3 ? "bg-violet-600" : "bg-gray-700"}`}></div>
        <div className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${selectedStepInPhoneModal >= 3 ? "bg-violet-600" : "bg-gray-700"} text-white`}
          >
            3
          </div>
          <p className={`ml-2 text-sm ${selectedStepInPhoneModal >= 3 ? "text-white" : "text-gray-500"}`}>Betalning</p>
        </div>
      </div>
    </div>
  )

  const PhoneSearchStep = () =>
    selectedAbonnemang && (
      <Fragment>
        <ProgressSteps />
        <div className="flex justify-center mt-11">
          <div className="bg-gray-800 mx-8 border border-gray-500/60 overflow-auto max-w-2xl w-full max-h-full rounded-lg shadow-lg">
            <div className="relative">
              <input
                className="w-full text-gray-300 bg-gray-800 border-0 focus:ring-transparent focus:outline-hidden focus:border-gray-500/60 placeholder-gray-500 appearance-none py-3 pl-10 border-b border-gray-500/60"
                type="search"
                placeholder="Sök efter telefon..."
                onChange={(e) => {
                  setPhoneSearch(e.target.value)
                  selectPhone(null)
                }}
                value={phoneSearch}
              />
              <button disabled className="absolute inset-0 right-auto group">
                <SearchIconBig className="shrink-0 fill-current text-gray-500 ml-4 mr-2" />
              </button>
            </div>
            {debouncedPhoneSearch.length > 0 && !selectedPhone ? (
              <div className="py-4 px-2">
                <div className="mb-3 last:mb-0">
                  <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Matchande resultat</div>
                  <motion.ul
                    className="text-sm max-h-[11.6rem] overflow-y-auto !scrollbar-thin !scrollbar-thumb-gray-400/70 !scrollbar-track-gray-800 !scrollbar-thumb-rounded-full !scrollbar-track-rounded-lg rounded-lg"
                    variants={staggerItems}
                    initial="hidden"
                    animate="visible"
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((phone) => (
                        <motion.li key={phone.id} variants={listItem}>
                          <button
                            type="button"
                            className="flex w-full items-center p-2 text-gray-100 hover:bg-gray-700/20 rounded-lg"
                            onClick={() => handlePhoneSelect(phone)}
                          >
                            <SearchIconSmall
                              className={`fill-current shrink-0 mr-3 ${
                                SpotdealManager.isSpotdeal(spotdeals, selectedAbonnemang, phone) ? "text-yellow-500" : "text-gray-500"
                              }`}
                            />
                            <span>
                              {phone.brand} {phone.model} {phone.storage}
                            </span>
                          </button>
                        </motion.li>
                      ))
                    ) : (
                      <motion.li className="text-gray-500 text-center py-2" variants={fadeIn}>
                        Inga resultat hittades för <i className="text-gray-400">{debouncedPhoneSearch}</i>.
                      </motion.li>
                    )}
                  </motion.ul>
                </div>
              </div>
            ) : (
              <motion.div className="pt-16 text-center pb-10" variants={fadeInUp} initial="hidden" animate="visible">
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </motion.svg>
                <motion.h3
                  className="text-lg font-medium text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Sök efter telefon
                </motion.h3>
                <motion.p className="text-gray-400 mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
                  Börja skriva för att hitta telefoner som matchar din sökning
                </motion.p>
              </motion.div>
            )}
          </div>
        </div>
      </Fragment>
    )

  const PhoneColorStep = () =>
    selectedPhone && (
      <Fragment>
        <ProgressSteps />
        <RadioGroup value={selectedPhone} onChange={selectPhone}>
          <div className={`mt-8 grid ${gridPhoneColumns()} gap-4 mb-9 px-4`}>
            {matchingPhones.map((phone, index) => (
              <Radio
                key={index}
                value={phone}
                className={`relative flex flex-col items-center cursor-pointer rounded-lg border bg-gray-800 p-2 sm:p-4 shadow-sm focus:outline-hidden ${
                  selectedPhone.color === phone.color ? "border-violet-600 ring-1 ring-violet-600" : "border-gray-600 hover:border-gray-500"
                } transition-colors`}
              >
                {({ checked }) => (
                  <Fragment>
                    <div className="flex flex-col items-center w-full">
                      <div className="w-full max-w-[80px] shrink-0 shadow-md">
                        <img src={phone.img} className="object-cover w-full h-auto" />
                      </div>
                      <Label className="font-semibold text-gray-100 text-sm sm:text-base text-center mt-2">{phone.color}</Label>
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                          transition={{ type: "spring", stiffness: 250, damping: 20 }}
                        >
                          <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
                        </motion.div>
                      </div>
                    </div>
                  </Fragment>
                )}
              </Radio>
            ))}
          </div>
        </RadioGroup>

        <div className="px-5 py-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <button type="button" className="btn-sm border-gray-700 hover:border-gray-600 text-gray-300" onClick={handleResetPhoneSelection}>
              &lt;- Tillbaka
            </button>
            <button type="button" className="btn-sm bg-gray-100 text-gray-800 hover:bg-white" onClick={goToNextStep}>
              Fortsätt -&gt;
            </button>
          </div>
        </div>
      </Fragment>
    )

  const PhonePaymentStep = () =>
    selectedPhone &&
    selectedAbonnemang && (
      <Fragment>
        <ProgressSteps />
        <div className="p-6">
          <div
            className={`relative rounded-xl ${
              SpotdealManager.isSpotdeal(spotdeals, selectedAbonnemang, selectedPhone) && "border border-2 border-yellow-500/70 p-6"
            }`}
          >
            {SpotdealManager.isSpotdeal(spotdeals, selectedAbonnemang, selectedPhone) && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="inline-flex items-center px-4 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full shadow-md">
                  <StarIcon className="h-4 w-4 text-gray-900 -ml-0.5 mr-1.5" />
                  <span className="text-sm font-bold text-gray-900">Spotdeal</span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-5">
              <img src={selectedPhone.img} className="w-20 h-auto object-contain" />

              <div className="flex-1 flex items-center justify-between mt-2">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {selectedPhone.brand} {selectedPhone.model}
                  </h3>
                  <p className="text-gray-400">
                    {selectedPhone.storage} - {selectedPhone.color}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-semibold text-white">{selectedPhone.price} kr</div>
                  <div className="text-gray-300 text-sm">Ordinarie pris</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <label className="text-gray-200">Rabatt på hårdvara:</label>

                <div className="relative w-full sm:w-32">
                  <input
                    className="bg-gray-700 rounded-md border-0 py-1.5 pr-10 text-white ring-1 ring-inset ring-gray-600 focus:ring-1 focus:ring-inset text-sm sm:text-base focus:ring-gray-600 w-full placeholder:text-gray-300"
                    placeholder="0"
                    value={phoneDiscount}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d{0,5}$/.test(value)) {
                        setPhoneDiscount(Number(value))
                      }
                    }}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-300 sm:text-sm">KR</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-200 mb-3">Betalningsalternativ:</label>
              <RadioGroup value={paymentOption} onChange={selectPaymentOption}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentOptions.map((option) => (
                    <Radio key={option.value} value={option.value} className="focus:outline-none">
                      {({ checked }) => (
                        <div
                          className={`relative p-4 rounded-lg border cursor-pointer ${
                            checked ? "border-violet-500 bg-violet-500/10" : "border-gray-600 bg-gray-800 hover:bg-gray-750/20"
                          } transition-all`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-white">{option.label}</h4>
                              <p className="text-sm text-gray-400">{option.description}</p>
                            </div>
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                              transition={{ type: "spring", stiffness: 250, damping: 20 }}
                            >
                              <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
                            </motion.div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-700 text-right">
                            {option.value === PaymentOption.DELBETALNING ? (
                              <span className="font-semibold text-violet-400">{calculateMonthlyPrice()} kr/mån</span>
                            ) : (
                              <span className="font-semibold text-violet-400">{calculateTotalPrice()} kr</span>
                            )}
                          </div>
                        </div>
                      )}
                    </Radio>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <button type="button" className="btn-sm border-gray-700 hover:border-gray-600 text-gray-300" onClick={goToPreviousStep}>
              &lt;- Tillbaka
            </button>
            <button type="submit" className="btn-sm bg-gray-100 text-gray-800 hover:bg-white">
              {selectedPhoneId ? "Uppdatera hårdvara" : "Lägg till hårdvara"}
            </button>
          </div>
        </div>
      </Fragment>
    )

  return (
    selectedAbonnemang && (
      <Transition appear show={isModalOpen(MODAL_ADD_PHONE_TO_CART)} as={Fragment}>
        <Dialog as="div" onClose={handleCloseModal}>
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
            <div className="flex min-h-full items-center justify-center">
              <TransitionChild
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-xl border border-gray-700/60 text-left shadow-xl w-full max-w-3xl">
                  <div className="bg-gray-800 h-full flex flex-col">
                    <div className="px-5 py-3 border-b border-gray-700/60">
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-gray-100 text-lg">Lägg till hårdvara</div>
                        <button type="button" className="text-gray-500 hover:text-gray-400" onClick={handleCloseModal}>
                          <CloseModalIcon />
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleFormSubmit}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          className={`${selectedStepInPhoneModal === 1 && "h-[450px]"}`}
                          key={selectedStepInPhoneModal}
                          initial={{
                            opacity: 0,
                            x: selectedDirectionInPhoneModal === "forward" ? 50 : selectedDirectionInPhoneModal === "backward" ? -50 : 0,
                          }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{
                            opacity: 0,
                            x: selectedDirectionInPhoneModal === "forward" ? -50 : selectedDirectionInPhoneModal === "backward" ? 50 : 0,
                          }}
                          transition={{ duration: 0.25 }}
                        >
                          {selectedStepInPhoneModal === 1 && PhoneSearchStep()}
                          {selectedStepInPhoneModal === 2 && PhoneColorStep()}
                          {selectedStepInPhoneModal === 3 && PhonePaymentStep()}
                        </motion.div>
                      </AnimatePresence>
                    </form>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
  )
}

export default ModalAddPhoneToCart
