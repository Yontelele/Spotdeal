import { RadioGroup, Radio } from "@headlessui/react"
import { CheckIcon, CurrencyDollarIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/solid"
import { Operatorer } from "../../../Enums/Operatorer"
import { MobilDealCategories } from "../../../Enums/MobilDealCategories"
import { NavLink } from "react-router-dom"
import { toLowerCase } from "../../../Helpers/StringHelper"
import { useState } from "react"
import { usePhoneContext } from "../../../Context/PhoneContext"
import { MobilDeal, MobilDealDto } from "../../../Models/MobilDealDto"
import { StarIcon } from "@heroicons/react/20/solid"
import { useCartContext } from "../../../Context/CartContext"
import { PhoneManager } from "../../../Managers/PhoneManager"
import { isTeliaOrHalebop } from "../../../Helpers/OperatorHelper"
import LoadingSpinner from "../../Common/LoadingSpinner"
import { RouteNames } from "../../../Enums/RouteNames"

const priceRadioAlternatives = [
  { value: "total", label: "Totalpris" },
  { value: "detailed", label: "Detaljerad" },
]

interface Props {
  mobildeal: MobilDealDto | null
}

const getPrimaryCategory = (categories: string[]): string => {
  if (categories.includes(MobilDealCategories.VI_REKOMMENDERAR)) {
    return MobilDealCategories.VI_REKOMMENDERAR
  } else if (categories.includes(MobilDealCategories.MEST_RABATT)) {
    return MobilDealCategories.MEST_RABATT
  } else if (categories.includes(MobilDealCategories.BILLIGASTE_ALTERNATIVET)) {
    return MobilDealCategories.BILLIGASTE_ALTERNATIVET
  }

  return categories[0] || ""
}

const getCategoryDescription = (category: string): string => {
  switch (category) {
    case MobilDealCategories.VI_REKOMMENDERAR:
      return "Vi rekommenderar detta abonnemang eftersom det erbjuder en optimal balans mellan pris, rabatt och surfmängd."
    case MobilDealCategories.BILLIGASTE_ALTERNATIVET:
      return "Det här abonnemanget erbjuder den lägsta månadsavgiften, vilket gör det till det mest kostnadseffektiva valet för dig."
    case MobilDealCategories.MEST_RABATT:
      return "Det här abonnemanget ger dig mest rabatt på telefonen, så att du kan spara mer när du köper en ny hårdvara."
    default:
      return ""
  }
}

export const MobilDealResult = ({ mobildeal }: Props) => {
  const [priceRadio, setPriceRadio] = useState(priceRadioAlternatives[0])
  const [activeTab, setActiveTab] = useState<number>(0)

  const { state } = usePhoneContext()
  const { selectedPhone } = state
  const { addAbonnemangWithPhoneToCart } = useCartContext()

  function handleSelectedOption(selectedMobilDeal: MobilDeal) {
    if (!mobildeal || !mobildeal.phone) return

    const phonePrice = isTeliaOrHalebop(selectedMobilDeal.abonnemang.operatorId)
      ? PhoneManager.calculateTeliaTotalPriceOnPhone(mobildeal.phone, selectedMobilDeal.phoneDiscount)
      : PhoneManager.calculateTotalPriceOnPhone(mobildeal.phone, selectedMobilDeal.phoneDiscount)

    const newPhoneInCart = {
      selectedPhone: mobildeal.phone,
      phonePricePerMonth: selectedMobilDeal.phoneMontlyCost,
      phonePrice: phonePrice,
      isDelbetalning: true,
    }

    addAbonnemangWithPhoneToCart(selectedMobilDeal.abonnemang, newPhoneInCart)
  }

  if (!mobildeal) return selectedPhone ? <LoadingSpinner text={"Hämtar de bästa erbjudanden..."} /> : null

  const activeDeal = mobildeal.mobildeals[activeTab]
  const primaryCategory = getPrimaryCategory(activeDeal.categories)
  const secondaryCategories = activeDeal.categories.filter((cat) => cat !== primaryCategory)

  return (
    <div className="animation-phonedeals">
      <div className="mt-36 row flex w-full">
        {mobildeal.mobildeals.map((deal, index) => {
          const isFirst = index === 0
          const isLast = index === mobildeal.mobildeals.length - 1
          const dealPrimaryCategory = getPrimaryCategory(deal.categories)

          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`w-full py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-gray-700 focus:shadow-none hover:bg-gray-700 ${
                isFirst && !isLast
                  ? "rounded-full rounded-r-none"
                  : isLast && !isFirst
                  ? "rounded-full rounded-l-none"
                  : mobildeal.mobildeals.length === 1
                  ? "rounded-full"
                  : ""
              } ${activeTab === index ? "bg-gray-700 shadow-none" : "bg-gray-800"}`}
            >
              {dealPrimaryCategory}
            </button>
          )
        })}
      </div>

      <div className={`mx-auto mt-12 rounded-3xl lg:mx-0 lg:flex ring-2 relative ${activeDeal.isSpotDeal ? "ring-yellow-500" : "ring-indigo-500"}`}>
        {activeDeal.isSpotDeal && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="inline-flex items-center px-4 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full shadow-md">
              <StarIcon className="h-4 w-4 text-gray-900 -ml-0.5 mr-1.5" />
              <span className="text-sm font-bold text-gray-900">Spotdeal</span>
            </div>
          </div>
        )}
        <div className="p-8 lg:flex-auto bg-white/5 rounded-l-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-white">{activeDeal.abonnemang.tableName}</h3>
            <img className="w-8 h-8 shrink-0 rounded-full" src={activeDeal.abonnemang.operator.logoUrl} alt={activeDeal.abonnemang.operator.name} />
            {activeDeal.abonnemang.extraSurf && (
              <span className="inline-flex items-center rounded-md bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-400/30">
                +{activeDeal.abonnemang.extraSurf} GB
              </span>
            )}
            {secondaryCategories.map((category, index) => (
              <div key={index} className="ml-2">
                {category.includes(MobilDealCategories.MEST_RABATT) ? (
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <DevicePhoneMobileIcon className="h-3 w-3" />
                    {category}
                  </span>
                ) : (
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CurrencyDollarIcon className="h-3 w-3" />
                    {category}
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="mt-6 text-base leading-7 text-gray-300">{getCategoryDescription(primaryCategory)}</p>

          <div className="mt-10 flex items-center gap-x-4">
            <h4 className={`flex-none text-sm font-semibold leading-6 ${activeDeal.isSpotDeal ? "text-yellow-400" : "text-indigo-400"}`}>Vad ingår</h4>
            <div className="h-px flex-auto bg-gray-700" />
          </div>
          <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-300 sm:grid-cols-2 sm:gap-6">
            <li className="flex gap-x-3">
              <CheckIcon className={`h-6 w-5 flex-none ${activeDeal.isSpotDeal ? "text-yellow-400" : "text-indigo-400"}`} />
              {activeDeal.phoneDiscount} kr rabatt på hårdvara
            </li>
            <li className="flex gap-x-3">
              <CheckIcon className={`h-6 w-5 flex-none ${activeDeal.isSpotDeal ? "text-yellow-400" : "text-indigo-400"}`} />
              {activeDeal.abonnemang.operatorId === Operatorer.TELIA
                ? "5G uppkoppling i Sveriges bästa nät"
                : activeDeal.abonnemang.operatorId === Operatorer.TELENOR
                ? "Kostnadsfria samtal inom familjen"
                : activeDeal.abonnemang.operatorId === Operatorer.TELE2
                ? "Pålitlig täckning i Sverige och stabilt nät"
                : activeDeal.abonnemang.operatorId === Operatorer.TRE
                ? "Uppkoppling i många länder i världen"
                : activeDeal.abonnemang.operatorId === Operatorer.HALEBOP
                ? "Gratis SMS från Sverige till hela världen"
                : ""}
            </li>
            <li className="flex gap-x-3">
              <CheckIcon className={`h-6 w-5 flex-none ${activeDeal.isSpotDeal ? "text-yellow-400" : "text-indigo-400"}`} />
              {mobildeal.phone.brand} {mobildeal.phone.model} {mobildeal.phone.storage}
            </li>
            <li className="flex gap-x-3">
              <CheckIcon className={`h-6 w-5 flex-none ${activeDeal.isSpotDeal ? "text-yellow-400" : "text-indigo-400"}`} />
              {activeDeal.abonnemang.canHaveExtraAnvandare ? "Möjlighet att lägga till extra användare" : "Abonnemang som inte ska delas med andra"}
            </li>
          </ul>
        </div>

        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0 bg-white/5 rounded-r-3xl">
          <div className="rounded-2xl bg-gray-800 py-10 text-center ring-inset lg:flex lg:flex-col lg:justify-center ring-1 ring-gray-900/5">
            <div className="mx-auto max-w-xs">
              <div className="px-8">
                <RadioGroup
                  value={priceRadio}
                  onChange={setPriceRadio}
                  className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-gray-300"
                >
                  {priceRadioAlternatives.map((option) => (
                    <Radio
                      key={option.value}
                      value={option}
                      className={({ checked }) => `cursor-pointer rounded-full px-2.5 py-1 text-white ${checked ? "bg-indigo-500 animation-radio" : ""}`}
                    >
                      <span>{option.label}</span>
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
              {priceRadio.value === "detailed" ? (
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-white animation-text-fade" key={priceRadio.value}>
                    {activeDeal.totalMonthlyCost - activeDeal.phoneMontlyCost} + {activeDeal.phoneMontlyCost}
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-400">kr/mån</span>
                </p>
              ) : (
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-white animation-text-fade" key={priceRadio.value}>
                    {activeDeal.totalMonthlyCost} kr
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-400">/månad</span>
                </p>
              )}
              <div className="px-8">
                <NavLink
                  onClick={() => handleSelectedOption(activeDeal)}
                  end
                  to={`${RouteNames.RegistreraAbonnemangPage}/${toLowerCase(activeDeal.abonnemang.operator.name)}`}
                  className="mt-6 block rounded-md bg-indigo-600 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Välj detta abonnemang
                </NavLink>
                <p className="mt-6 text-xs leading-5 text-gray-400">{`För att ta del av detta erbjudande krävs en bindningstid på ${activeDeal.abonnemang.bindningstid} månader`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobilDealResult
