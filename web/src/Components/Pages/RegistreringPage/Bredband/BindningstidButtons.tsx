import { useCartContext } from "../../../../Context/CartContext"
import { Bindningstider } from "../../../../Enums/Bindningstider"
import { ContractType } from "../../../../Enums/ContractType"
import { Operatorer } from "../../../../Enums/Operatorer"

const BindningstidConfigBredband: Record<Operatorer, { bindningstid: Bindningstider; text: string }[]> = {
  [Operatorer.TELE2]: [
    { bindningstid: Bindningstider.TJUGO_FYRA_MÅNADER_BINDNINGSTID, text: "24 Månader" },
    { bindningstid: Bindningstider.TOLV_MÅNADER_BINDNINGSTID, text: "12 Månader" },
    { bindningstid: Bindningstider.INGEN_BINDNINGSTID, text: "Ingen bindningstid" },
  ],
  [Operatorer.TRE]: [{ bindningstid: Bindningstider.TJUGO_FYRA_MÅNADER_BINDNINGSTID, text: "24 Månader" }],
  [Operatorer.TELIA]: [
    { bindningstid: Bindningstider.TJUGO_FYRA_MÅNADER_BINDNINGSTID, text: "24 Månader" },
    { bindningstid: Bindningstider.TOLV_MÅNADER_BINDNINGSTID, text: "12 Månader" },
  ],
  [Operatorer.TELENOR]: [
    { bindningstid: Bindningstider.TJUGO_FYRA_MÅNADER_BINDNINGSTID, text: "24 Månader" },
    { bindningstid: Bindningstider.INGEN_BINDNINGSTID, text: "Ingen bindningstid" },
  ],
  [Operatorer.HALEBOP]: [],
}

const BindningstidConfigTv: Record<Operatorer, { bindningstid: Bindningstider; text: string }[]> = {
  [Operatorer.TELE2]: [
    { bindningstid: Bindningstider.TJUGO_FYRA_MÅNADER_BINDNINGSTID, text: "24 Månader" },
    { bindningstid: Bindningstider.INGEN_BINDNINGSTID, text: "Ingen bindningstid" },
  ],
  [Operatorer.TELIA]: [{ bindningstid: Bindningstider.TOLV_MÅNADER_BINDNINGSTID, text: "12 Månader" }],
  [Operatorer.TRE]: [],
  [Operatorer.TELENOR]: [],
  [Operatorer.HALEBOP]: [],
}

interface Props {
  operatorId: Operatorer
  contractType: ContractType
}

export const BindningstidButtons = ({ operatorId, contractType }: Props) => {
  const { state, selectBindningstid } = useCartContext()
  const { selectedBindningstid } = state

  const handleButtonClick = (bindningstid: Bindningstider) => selectBindningstid(bindningstid)

  const CONFIG = contractType === ContractType.Bredband ? BindningstidConfigBredband : BindningstidConfigTv

  return (
    <div className="mt-32 flex w-full">
      {CONFIG[operatorId].map((button, index) => {
        let roundedSide: "left" | "right" | "both" | undefined = undefined
        if (CONFIG[operatorId].length > 1) {
          if (index === 0) roundedSide = "left"
          else if (index === CONFIG[operatorId].length - 1) roundedSide = "right"
        } else {
          roundedSide = "both"
        }
        return (
          <BindningstidButton
            key={button.bindningstid}
            bindningstid={button.bindningstid}
            text={button.text}
            isSelected={selectedBindningstid === button.bindningstid}
            roundedSide={roundedSide}
            onClick={() => handleButtonClick(button.bindningstid)}
          />
        )
      })}
    </div>
  )
}

interface BindningstidButtonProps {
  bindningstid: Bindningstider
  text: string
  isSelected: boolean
  roundedSide?: "left" | "right" | "both"
  onClick: () => void
}

const BindningstidButton = ({ text, isSelected, roundedSide, onClick }: BindningstidButtonProps) => {
  const getRoundedClass = () => {
    if (roundedSide === "left") return "rounded-l-full"
    if (roundedSide === "right") return "rounded-r-full"
    if (roundedSide === "both") return "rounded-full"
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

export default BindningstidButtons
