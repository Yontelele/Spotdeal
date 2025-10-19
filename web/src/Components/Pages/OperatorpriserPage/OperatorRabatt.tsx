import { useAbonnemang } from "../../../Hooks/useAbonnemang"
import { OperatorDto } from "../../../Models/OperatorDto"

interface Props {
  operator: OperatorDto
}

export const OperatorRabatt = ({ operator }: Props) => {
  const { abonnemangInLathundOrMobilDeal } = useAbonnemang()

  return (
    <div className="flex flex-col col-span-full xl:col-span-6 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm sm:p-8">
      <div className="flex justify-between">
        <div className="text-xl font-bold leading-none text-gray-100 mb-4">Generell rabatt</div>
        <div className="text-xl font-bold leading-none text-gray-100 mb-4">Rabatt</div>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-700">
          {abonnemangInLathundOrMobilDeal
            .filter((a) => a.showInTable && a.operatorId === operator.id)
            .map((abonnemang) => {
              return (
                <li className="py-3 sm:py-4" key={abonnemang.id}>
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <img className="w-8 h-8 rounded-full" src={operator.logoUrl} />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <div className="text-base font-semibold text-gray-100 truncate">{abonnemang.discount} kr</div>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-100 truncate">0 kr</div>
                  </div>
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}

export default OperatorRabatt
