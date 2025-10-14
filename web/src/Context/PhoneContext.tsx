import { FC, ReactNode, createContext, useContext, useReducer } from "react"
import { usePhone } from "../Hooks/usePhone"
import { PhoneDto } from "../Models/PhoneDto"
import { PhoneManager } from "../Managers/PhoneManager"
import { useSpotDeal } from "../Hooks/useSpotDeal"
import toast from "react-hot-toast"
import { ToastConfig } from "../Helpers/ToastHelper"
import { AbonnemangInCart, PhoneInCart } from "../Models/CartDto"
import { useCartContext } from "./CartContext"
import { MODAL_ADD_PHONE_TO_CART } from "../Helpers/ModalHelper"
import { useAppContext } from "./AppContext"
import { PaymentOption } from "../Enums/PaymentOption"
import { isTeliaOrHalebop } from "../Helpers/OperatorHelper"

type Action =
  | { type: "SET_PHONE_SEARCH"; payload: string }
  | { type: "SELECT_PHONE"; payload: PhoneDto | null }
  | { type: "SET_SELECTED_PHONE_ID"; payload: string }
  | { type: "SET_PHONE_DISCOUNT"; payload: number }
  | { type: "SELECT_PAYMENT_OPTION"; payload: PaymentOption }
  | { type: "EDIT_PHONE"; payload: PhoneInCart }
  | { type: "SET_STEP_IN_PHONE_MODAL"; payload: number }
  | { type: "SET_DIRECTION_IN_PHONE_MODAL"; payload: "forward" | "backward" | null }
  | { type: "CLEAR_PHONE_SELECT" }

interface PhoneState {
  phoneSearch: string
  selectedPhone: PhoneDto | null
  selectedPhoneId: string
  phoneDiscount: number
  paymentOption: PaymentOption
  selectedStepInPhoneModal: number
  selectedDirectionInPhoneModal: "forward" | "backward" | null
}

const initialState: PhoneState = {
  phoneSearch: "",
  selectedPhone: null,
  selectedPhoneId: "",
  phoneDiscount: 0,
  paymentOption: PaymentOption.DELBETALNING,
  selectedStepInPhoneModal: 1,
  selectedDirectionInPhoneModal: null,
}

function phoneReducer(state: PhoneState, action: Action): PhoneState {
  switch (action.type) {
    case "SET_PHONE_SEARCH":
      return { ...state, phoneSearch: action.payload }
    case "SELECT_PHONE":
      return { ...state, selectedPhone: action.payload }
    case "SET_PHONE_DISCOUNT":
      return { ...state, phoneDiscount: action.payload }
    case "SELECT_PAYMENT_OPTION":
      return { ...state, paymentOption: action.payload }
    case "SET_STEP_IN_PHONE_MODAL":
      return { ...state, selectedStepInPhoneModal: action.payload }
    case "SET_DIRECTION_IN_PHONE_MODAL":
      return { ...state, selectedDirectionInPhoneModal: action.payload }
    case "CLEAR_PHONE_SELECT":
      return initialState
    case "EDIT_PHONE":
      const { selectedPhone, isDelbetalning, uniqueId, phonePrice } = action.payload
      return {
        phoneSearch: `${selectedPhone.brand} ${selectedPhone.model} ${selectedPhone.storage}`,
        selectedPhone: selectedPhone,
        selectedPhoneId: uniqueId,
        phoneDiscount: selectedPhone.price - phonePrice,
        paymentOption: isDelbetalning ? PaymentOption.DELBETALNING : PaymentOption.BETALA_DIREKT,
        selectedStepInPhoneModal: 3,
        selectedDirectionInPhoneModal: null,
      }
    default:
      return state
  }
}

interface ContextProps {
  state: PhoneState
  phones: PhoneDto[]

  setPhoneSearch: (search: string) => void
  selectPhone: (phone: PhoneDto | null) => void
  setPhoneDiscount: (rabatt: number) => void
  selectPaymentOption: (option: PaymentOption) => void
  openPhoneModal: (abonnemang: AbonnemangInCart) => void
  closePhoneModal: () => void
  setStepInPhoneModal: (step: number) => void
  setDirectionInPhoneModal: (direction: "forward" | "backward" | null) => void
  editPhone: (phone: PhoneInCart) => void

  findPhoneSearchResults: (search: string) => PhoneDto[]
  findMatchingPhones: (phone: PhoneDto | null) => PhoneDto[]
  operationAddPhoneToCart: (subscription: AbonnemangInCart) => boolean
}

interface ProviderProps {
  children: ReactNode
}

const PhoneContext = createContext<ContextProps | undefined>(undefined)

const PhoneProvider: FC<ProviderProps> = ({ children }) => {
  const { phones } = usePhone()
  const { spotdeals } = useSpotDeal()
  const { handleShowModal } = useAppContext()
  const { addPhoneToCart, updatePhoneInCart, state: cartState, selectAbonnemang } = useCartContext()
  const { selectedAbonnemang } = cartState

  const [state, dispatch] = useReducer(phoneReducer, initialState)
  const { selectedPhone, selectedPhoneId, phoneDiscount, paymentOption } = state

  const setPhoneSearch = (search: string) => {
    dispatch({ type: "SET_PHONE_SEARCH", payload: search })
    if (selectedPhone) {
      dispatch({ type: "SELECT_PHONE", payload: null })
    }
  }

  const setPhoneDiscount = (discount: number) => {
    dispatch({ type: "SET_PHONE_DISCOUNT", payload: discount })
  }

  const selectPaymentOption = (option: PaymentOption) => {
    dispatch({ type: "SELECT_PAYMENT_OPTION", payload: option })
  }

  const selectPhone = (phone: PhoneDto | null) => {
    dispatch({ type: "SELECT_PHONE", payload: phone })

    if (phone) {
      dispatch({ type: "SET_PHONE_SEARCH", payload: `${phone.brand} ${phone.model} ${phone.storage}` })

      if (selectedAbonnemang) {
        const discount = PhoneManager.getDiscountOnSelectedPhone(spotdeals, selectedAbonnemang, phone)
        dispatch({ type: "SET_PHONE_DISCOUNT", payload: discount })
      }
    }
  }

  const setStepInPhoneModal = (step: number) => {
    dispatch({ type: "SET_STEP_IN_PHONE_MODAL", payload: step })
  }

  const setDirectionInPhoneModal = (direction: "forward" | "backward" | null) => {
    dispatch({ type: "SET_DIRECTION_IN_PHONE_MODAL", payload: direction })
  }

  const openPhoneModal = (abonnemang: AbonnemangInCart) => {
    dispatch({ type: "CLEAR_PHONE_SELECT" })
    selectAbonnemang(abonnemang)
    handleShowModal(MODAL_ADD_PHONE_TO_CART)
  }

  const closePhoneModal = () => {
    handleShowModal(MODAL_ADD_PHONE_TO_CART)
    dispatch({ type: "CLEAR_PHONE_SELECT" })
  }

  const editPhone = (phone: PhoneInCart) => {
    dispatch({ type: "EDIT_PHONE", payload: phone })
    selectAbonnemang(phone.selectedAbonnemang)
    handleShowModal(MODAL_ADD_PHONE_TO_CART)
  }

  const findPhoneSearchResults = (search: string) => {
    if (search.length <= 0) return []

    const searchTerms = search.toLowerCase().split(" ")

    const filteredPhones = phones.filter((phone) => {
      return searchTerms.every(
        (term) =>
          phone.brand.toLowerCase().includes(term) ||
          phone.model.toLowerCase().includes(term) ||
          phone.storage.toLowerCase().includes(term) ||
          phone.code.toLowerCase().includes(term)
      )
    })

    const phoneMap = new Map()
    filteredPhones.forEach((phone) => {
      const key = `${phone.brand}-${phone.model}-${phone.storage}`
      if (!phoneMap.has(key)) phoneMap.set(key, phone)
    })

    return Array.from(phoneMap.values())
  }

  const findMatchingPhones = (phone: PhoneDto | null) => {
    if (!phone) return []

    return phones.filter((p) => p.brand === phone.brand && p.model === phone.model && p.storage === phone.storage)
  }

  function operationAddPhoneToCart(abonnemang: AbonnemangInCart): boolean {
    if (!selectedPhone || !abonnemang) {
      toast.error("Du måste välja en telefon och ett abonnemang", ToastConfig)
      return false
    }

    const isDelbetalning = paymentOption === PaymentOption.DELBETALNING
    let phonePricePerMonth: number | null
    let phonePrice: number

    if (isDelbetalning) {
      phonePricePerMonth = isTeliaOrHalebop(abonnemang.operatorId)
        ? PhoneManager.calculateTeliaMonthlyPriceOnPhone(selectedPhone, phoneDiscount)
        : PhoneManager.calculateMonthlyPriceOnPhone(selectedPhone, phoneDiscount)

      phonePrice = isTeliaOrHalebop(abonnemang.operatorId)
        ? PhoneManager.calculateTeliaTotalPriceOnPhone(selectedPhone, phoneDiscount)
        : PhoneManager.calculateTotalPriceOnPhone(selectedPhone, phoneDiscount)

      const priceValidation = PhoneManager.isPhonePriceValid(abonnemang.operatorId, phonePricePerMonth)
      if (!priceValidation.isValid) {
        toast.error(priceValidation.errorMessage, ToastConfig)
        return false
      }
    } else {
      phonePrice = selectedPhone.price - phoneDiscount
      phonePricePerMonth = null
    }

    if (phoneDiscount > selectedPhone.price) {
      toast.error("Rabatten kan inte vara större än telefonens totala pris.", ToastConfig)
      return false
    }

    const newPhoneInCart: PhoneInCart = {
      uniqueId: "",
      selectedPhone,
      selectedAbonnemang: abonnemang,
      phonePricePerMonth,
      phonePrice,
      isDelbetalning,
    }

    if (selectedPhoneId) {
      updatePhoneInCart({ ...newPhoneInCart, uniqueId: selectedPhoneId })
    } else {
      addPhoneToCart(newPhoneInCart)
    }

    return true
  }

  const value: ContextProps = {
    state,
    phones,
    setPhoneSearch,
    setPhoneDiscount,
    selectPaymentOption,
    findPhoneSearchResults,
    findMatchingPhones,
    selectPhone,
    openPhoneModal,
    closePhoneModal,
    setStepInPhoneModal,
    setDirectionInPhoneModal,
    operationAddPhoneToCart,
    editPhone,
  }

  return <PhoneContext.Provider value={value}>{children}</PhoneContext.Provider>
}

const usePhoneContext = () => {
  const context = useContext(PhoneContext)
  if (!context) throw new Error("usePhoneContext must be used within an PhoneProvider")
  return context
}

export { PhoneProvider, usePhoneContext }
