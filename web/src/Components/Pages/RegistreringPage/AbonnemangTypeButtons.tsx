import { useCartContext } from "../../../Context/CartContext"
import { AbonnemangType } from "../../../Enums/AbonnemangType"
import { Operatorer } from "../../../Enums/Operatorer"

const AbonnemangTypeConfig: Record<Operatorer, { type: AbonnemangType; text: string }[]> = {
  [Operatorer.TELE2]: [
    { type: AbonnemangType.Nyteck, text: "Nytt abonnemang" },
    { type: AbonnemangType.Befintlig, text: "Förlängning abonnemang" },
    { type: AbonnemangType.ExtraAnv, text: "Extra användare" },
  ],
  [Operatorer.TRE]: [
    { type: AbonnemangType.Nyteck, text: "Nytt abonnemang" },
    { type: AbonnemangType.Befintlig, text: "Förlängning abonnemang" },
    { type: AbonnemangType.ExtraAnv, text: "Extra användare" },
  ],
  [Operatorer.TELIA]: [
    { type: AbonnemangType.Nyteck, text: "Nytt abonnemang" },
    { type: AbonnemangType.Befintlig, text: "Förlängning abonnemang" },
    { type: AbonnemangType.Ungdom, text: "Ungdoms abonnemang" },
    { type: AbonnemangType.ExtraAnv, text: "Extra användare" },
  ],
  [Operatorer.TELENOR]: [
    { type: AbonnemangType.Nyteck, text: "Nytt abonnemang" },
    { type: AbonnemangType.Befintlig, text: "Förlängning abonnemang" },
    { type: AbonnemangType.ExtraAnv, text: "Extra användare" },
  ],
  [Operatorer.HALEBOP]: [
    { type: AbonnemangType.Nyteck, text: "Nytt abonnemang" },
    { type: AbonnemangType.Befintlig, text: "Förlängning abonnemang" },
    { type: AbonnemangType.Ungdom, text: "Student abonnemang" },
    { type: AbonnemangType.ExtraAnv, text: "Extra användare" },
  ],
}

interface Props {
  operatorId: Operatorer
}

export const AbonnemangTypeButtons = ({ operatorId }: Props) => {
  const { state, selectAbonnemangType } = useCartContext()
  const { selectedAbonnemangType } = state

  const handleButtonClick = (type: AbonnemangType) => selectAbonnemangType(type)

  return (
    <div className="mt-32 flex w-full">
      {AbonnemangTypeConfig[operatorId].map((button, index) => {
        const roundedSide = index === 0 ? "left" : index === AbonnemangTypeConfig[operatorId].length - 1 ? "right" : undefined
        return (
          <AbonnemangTypeButton
            key={button.type}
            type={button.type}
            text={button.text}
            isSelected={selectedAbonnemangType === button.type}
            roundedSide={roundedSide}
            onClick={() => handleButtonClick(button.type)}
          />
        )
      })}
    </div>
  )
}

interface AbonnemangTypeButtonProps {
  type: AbonnemangType
  text: string
  isSelected: boolean
  roundedSide?: "left" | "right"
  onClick: () => void
}

const AbonnemangTypeButton = ({ text, isSelected, roundedSide, onClick }: AbonnemangTypeButtonProps) => {
  const getRoundedClass = () => {
    if (roundedSide === "left") return "rounded-l-full"
    if (roundedSide === "right") return "rounded-r-full"
    return ""
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
          w-full py-2 px-4 border border-transparent text-center text-sm text-white
          transition-all shadow-md hover:shadow-lg focus:bg-gray-700 focus:shadow-none 
          hover:bg-gray-700 ${getRoundedClass()}
          ${isSelected ? "bg-gray-700 shadow-none" : "bg-gray-800"}
        `}
    >
      {text}
    </button>
  )
}

export default AbonnemangTypeButtons
