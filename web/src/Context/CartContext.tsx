import { FC, ReactNode, createContext, useContext, useReducer } from "react"
import { OperatorDto } from "../Models/OperatorDto"
import { AbonnemangDto } from "../Models/AbonnemangDto"
import { AbonnemangType } from "../Enums/AbonnemangType"
import { useAbonnemang } from "../Hooks/useAbonnemang"
import { CartManager } from "../Managers/CartManager"
import { DelbetalningManager } from "../Managers/DelbetalningManager"
import { AbonnemangInCart, PhoneInCart } from "../Models/CartDto"
import toast from "react-hot-toast"
import { ToastConfig } from "../Helpers/ToastHelper"
import { PhoneInMobilDeal } from "../Models/MobilDealDto"
import { isTeliaOrHalebop } from "../Helpers/OperatorHelper"
import { BredbandDto } from "../Models/BredbandDto"
import { TvStreamingDto } from "../Models/TvStreamingDto"
import { Bindningstider } from "../Enums/Bindningstider"
import { useBredband } from "../Hooks/useBredband"
import { useTvStreaming } from "../Hooks/useTvStreaming"
import { ContractType } from "../Enums/ContractType"

type Action =
  | { type: "ADD_ABONNEMANG_TO_CART"; payload: AbonnemangDto[] }
  | { type: "REMOVE_ABONNEMANG_FROM_CART"; payload: AbonnemangInCart }
  | {
      type: "ADD_ABONNEMANG_WITH_PHONE_TO_CART"
      payload: { huvudAbonnemang: AbonnemangDto; phone: PhoneInMobilDeal; abonnemangInLathundOrMobilDeal: AbonnemangDto[] }
    }
  | { type: "ADD_PHONE_TO_CART"; payload: { phone: PhoneInCart; abonnemang: AbonnemangDto[] } }
  | { type: "UPDATE_PHONE_IN_CART"; payload: { phone: PhoneInCart; abonnemang: AbonnemangDto[] } }
  | { type: "REMOVE_PHONE_FROM_CART"; payload: { phone: PhoneInCart; abonnemang: AbonnemangDto[] } }
  | { type: "SELECT_ABONNEMANG"; payload: AbonnemangInCart | null }
  | { type: "SELECT_ABONNEMANG_TYPE"; payload: AbonnemangType }
  | { type: "SELECT_HUVUD_ABONNEMANG"; payload: AbonnemangDto | null }
  | { type: "SELECT_OPERATOR"; payload: OperatorDto }
  | { type: "SELECT_BREDBAND"; payload: BredbandDto | null }
  | { type: "SELECT_TV_STREAMING"; payload: TvStreamingDto | null }
  | { type: "SELECT_BINDNINGSTID"; payload: Bindningstider }

interface CartState {
  selectedOperator: OperatorDto | null
  selectedAbonnemang: AbonnemangInCart | null
  selectedAbonnemangType: AbonnemangType
  selectedHuvudAbonnemang: AbonnemangDto | null
  selectedBredband: BredbandDto | null
  selectedTvStreaming: TvStreamingDto | null
  selectedBindningstid: Bindningstider
  cart: {
    abonnemangCart: AbonnemangInCart[]
    phoneCart: PhoneInCart[]
  }
}

const initialState: CartState = {
  selectedOperator: null,
  selectedAbonnemang: null,
  selectedAbonnemangType: AbonnemangType.Nyteck,
  selectedHuvudAbonnemang: null,
  selectedBredband: null,
  selectedTvStreaming: null,
  selectedBindningstid: Bindningstider.TJUGO_FYRA_MÅNADER_BINDNINGSTID,
  cart: {
    abonnemangCart: [],
    phoneCart: [],
  },
}

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "SELECT_OPERATOR":
      return { ...initialState, selectedOperator: action.payload }
    case "SELECT_ABONNEMANG":
      return { ...state, selectedAbonnemang: action.payload }
    case "SELECT_ABONNEMANG_TYPE":
      return { ...state, selectedAbonnemangType: action.payload, selectedHuvudAbonnemang: null }
    case "SELECT_BINDNINGSTID":
      return { ...state, selectedBindningstid: action.payload, selectedBredband: null, selectedTvStreaming: null }
    case "SELECT_HUVUD_ABONNEMANG":
      return {
        ...state,
        selectedHuvudAbonnemang: action.payload,
        cart: {
          abonnemangCart: action.payload ? [CartManager.generateUniqueIdAbonnemangInCart(action.payload)] : [],
          phoneCart: [],
        },
      }
    case "SELECT_BREDBAND":
      return {
        ...state,
        selectedBredband: action.payload,
        cart: {
          abonnemangCart: [],
          phoneCart: [],
        },
      }
    case "SELECT_TV_STREAMING":
      return {
        ...state,
        selectedTvStreaming: action.payload,
        cart: {
          abonnemangCart: [],
          phoneCart: [],
        },
      }
    case "ADD_ABONNEMANG_TO_CART":
      if (!state.selectedHuvudAbonnemang) return state
      return {
        ...state,
        cart: { ...state.cart, abonnemangCart: CartManager.addAbonnemangToCart(state.selectedHuvudAbonnemang, action.payload, state.cart.abonnemangCart) },
      }
    case "REMOVE_ABONNEMANG_FROM_CART":
      return {
        ...state,
        selectedHuvudAbonnemang:
          state.cart.abonnemangCart.length <= 1
            ? null
            : action.payload.isHuvudAbonnemang && action.payload.canHaveExtraAnvandare
            ? null
            : state.selectedHuvudAbonnemang,
        cart: {
          abonnemangCart: state.cart.abonnemangCart.filter((abonnemang) => abonnemang.uniqueId !== action.payload.uniqueId),
          phoneCart: state.cart.phoneCart.filter((phone) => phone.selectedAbonnemang.uniqueId !== action.payload.uniqueId),
        },
      }
    case "ADD_ABONNEMANG_WITH_PHONE_TO_CART": {
      const { huvudAbonnemang, phone, abonnemangInLathundOrMobilDeal } = action.payload
      const abonnemangInCart = CartManager.generateUniqueIdAbonnemangInCart(huvudAbonnemang)
      const updatedPhone = { ...phone, selectedAbonnemang: abonnemangInCart, uniqueId: "" }

      const phoneCart = CartManager.addPhoneToCart(state.cart.phoneCart, updatedPhone)

      return {
        ...state,
        selectedHuvudAbonnemang: isTeliaOrHalebop(abonnemangInCart.operatorId)
          ? DelbetalningManager.findRegularAbonnemang(abonnemangInCart, abonnemangInLathundOrMobilDeal)
          : abonnemangInCart,
        cart: {
          abonnemangCart: [abonnemangInCart],
          phoneCart: phoneCart,
        },
      }
    }

    case "ADD_PHONE_TO_CART": {
      const { phone, abonnemang } = action.payload
      const newPhoneCart = CartManager.addPhoneToCart(state.cart.phoneCart, phone)
      const updatedAbonnemangCart = DelbetalningManager.updateCartWithDelbetalningAbonnemang(state.cart.abonnemangCart, newPhoneCart, abonnemang)
      const updatedPhoneCart = DelbetalningManager.updatePhonesWithUpdatedAbonnemang(newPhoneCart, updatedAbonnemangCart)
      return {
        ...state,
        cart: {
          abonnemangCart: updatedAbonnemangCart,
          phoneCart: updatedPhoneCart,
        },
      }
    }
    case "UPDATE_PHONE_IN_CART": {
      const { phone, abonnemang } = action.payload
      const updatedPhones = state.cart.phoneCart.map((p) => (p.uniqueId === phone.uniqueId ? phone : p))
      const updatedSubscriptions = DelbetalningManager.updateCartWithDelbetalningAbonnemang(state.cart.abonnemangCart, updatedPhones, abonnemang)
      const finalUpdatedPhones = DelbetalningManager.updatePhonesWithUpdatedAbonnemang(updatedPhones, updatedSubscriptions)
      return {
        ...state,
        cart: {
          abonnemangCart: updatedSubscriptions,
          phoneCart: finalUpdatedPhones,
        },
      }
    }
    case "REMOVE_PHONE_FROM_CART": {
      const { phone, abonnemang } = action.payload
      const remainingPhones = state.cart.phoneCart.filter((p) => p.uniqueId !== phone.uniqueId)
      const updatedAbonnemangs = DelbetalningManager.updateCartWithDelbetalningAbonnemang(state.cart.abonnemangCart, remainingPhones, abonnemang)
      const finalRemainingPhones = DelbetalningManager.updatePhonesWithUpdatedAbonnemang(remainingPhones, updatedAbonnemangs)
      return {
        ...state,
        cart: {
          abonnemangCart: updatedAbonnemangs,
          phoneCart: finalRemainingPhones,
        },
      }
    }
    default:
      return state
  }
}

interface ContextProps {
  selectOperator: (operator: OperatorDto, contractType: ContractType) => void
  selectAbonnemangType: (type: AbonnemangType) => void
  selectHuvudAbonnemang: (abonnemang: AbonnemangDto | null) => void
  selectAbonnemang: (abonnemang: AbonnemangInCart | null) => void
  selectBredband: (bredband: BredbandDto | null) => void
  selectTvStreaming: (tvStreaming: TvStreamingDto | null) => void
  selectBindningstid: (bindningstid: Bindningstider) => void
  addAbonnemangToCart: () => void
  removeAbonnemangFromCart: (abonnemangToRemove: AbonnemangInCart) => void
  addAbonnemangWithPhoneToCart: (huvudAbonnemang: AbonnemangDto, phone: PhoneInMobilDeal) => void
  addPhoneToCart: (phone: PhoneInCart) => void
  updatePhoneInCart: (phone: PhoneInCart) => void
  removePhoneFromCart: (phone: PhoneInCart) => void
  state: CartState
  abonnemang: AbonnemangDto[]
  bredband: BredbandDto[]
  tvStreaming: TvStreamingDto[]
}

interface ProviderProps {
  children: ReactNode
}

const CartContext = createContext<ContextProps | undefined>(undefined)

const CartProvider: FC<ProviderProps> = ({ children }) => {
  const { getAbonnemangForOperator, abonnemang, abonnemangInLathundOrMobilDeal } = useAbonnemang()
  const { bredband, getBredbandForOperator } = useBredband()
  const { tvStreaming, getTvStreamingForOperator } = useTvStreaming()
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const selectOperator = (operator: OperatorDto, contractType: ContractType) => {
    dispatch({ type: "SELECT_OPERATOR", payload: operator })

    switch (contractType) {
      case ContractType.Abonnemang:
        return getAbonnemangForOperator(operator)
      case ContractType.Bredband:
        return getBredbandForOperator(operator)
      case ContractType.TV:
        return getTvStreamingForOperator(operator)
    }
  }

  const selectAbonnemangType = (type: AbonnemangType) => {
    dispatch({ type: "SELECT_ABONNEMANG_TYPE", payload: type })
  }

  const selectHuvudAbonnemang = (abonnemang: AbonnemangDto | null) => {
    dispatch({ type: "SELECT_HUVUD_ABONNEMANG", payload: abonnemang })
  }

  const selectAbonnemang = (abonnemang: AbonnemangInCart | null) => {
    dispatch({ type: "SELECT_ABONNEMANG", payload: abonnemang })
  }

  const selectBredband = (bredband: BredbandDto | null) => {
    dispatch({ type: "SELECT_BREDBAND", payload: bredband })
  }

  const selectTvStreaming = (tvStreaming: TvStreamingDto | null) => {
    dispatch({ type: "SELECT_TV_STREAMING", payload: tvStreaming })
  }

  const selectBindningstid = (bindningstid: Bindningstider) => {
    dispatch({ type: "SELECT_BINDNINGSTID", payload: bindningstid })
  }

  const addAbonnemangToCart = () => {
    dispatch({ type: "ADD_ABONNEMANG_TO_CART", payload: abonnemang })
  }

  const removeAbonnemangFromCart = (abonnemangToRemove: AbonnemangInCart) => {
    dispatch({ type: "REMOVE_ABONNEMANG_FROM_CART", payload: abonnemangToRemove })
  }

  const addAbonnemangWithPhoneToCart = (huvudAbonnemang: AbonnemangDto, phone: PhoneInMobilDeal) => {
    selectOperator(huvudAbonnemang.operator, ContractType.Abonnemang)
    dispatch({ type: "ADD_ABONNEMANG_WITH_PHONE_TO_CART", payload: { huvudAbonnemang, phone, abonnemangInLathundOrMobilDeal } })
    toast.success("Mobildeal tillagd i varukorgen", ToastConfig)
  }

  const addPhoneToCart = (phone: PhoneInCart) => {
    dispatch({ type: "ADD_PHONE_TO_CART", payload: { phone, abonnemang } })
    toast.success("Telefon tillagd i varukorgen", ToastConfig)
  }

  const updatePhoneInCart = (phone: PhoneInCart) => {
    dispatch({ type: "UPDATE_PHONE_IN_CART", payload: { phone, abonnemang } })
    toast.success("Telefon uppdaterad i varukorgen", ToastConfig)
  }

  const removePhoneFromCart = (phone: PhoneInCart) => {
    dispatch({ type: "REMOVE_PHONE_FROM_CART", payload: { phone, abonnemang } })
    toast.success("Telefon borttagen från varukorgen", ToastConfig)
  }

  const value: ContextProps = {
    selectOperator,
    selectAbonnemangType,
    selectHuvudAbonnemang,
    selectAbonnemang,
    selectBredband,
    selectTvStreaming,
    selectBindningstid,
    addAbonnemangToCart,
    removeAbonnemangFromCart,
    addAbonnemangWithPhoneToCart,
    addPhoneToCart,
    updatePhoneInCart,
    removePhoneFromCart,
    state,
    abonnemang,
    bredband,
    tvStreaming,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCartContext must be used within an CartProvider")
  return context
}

export { CartProvider, useCartContext }
