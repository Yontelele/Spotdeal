import { capitalizeFirstLetter } from "../../../Helpers/StringHelper"
import { useAbonnemang } from "../../../Hooks/useAbonnemang"
import { OperatorDto } from "../../../Models/OperatorDto"

interface Props {
  operator: OperatorDto
}

export const OperatorPris = ({ operator }: Props) => {
  const { abonnemangInLathundOrMobilDeal } = useAbonnemang()

  return (
    <div className="flex flex-col col-span-full xl:col-span-6 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm sm:p-8">
      <div className="text-xl font-bold leading-none text-gray-100 mb-4">{capitalizeFirstLetter(operator.name)}</div>
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
                      <div className="text-sm font-medium text-gray-100 truncate">
                        {abonnemang.tableName}
                        {abonnemang.extraSurf && (
                          <span className="inline-flex items-center rounded-md bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-400/30 ml-4">
                            +{abonnemang.extraSurf} GB
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-100">
                      {abonnemang.monthlyDiscount &&
                        (abonnemang.monthlyDiscount >= 50 ? (
                          <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/30 mr-4">
                            {`-${abonnemang.monthlyDiscount} kr/mån i ${abonnemang.monthlyDiscountDuration}mån`}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/30 mr-4">
                            {`-${abonnemang.monthlyDiscount} kr/mån i ${abonnemang.monthlyDiscountDuration}mån`}
                          </span>
                        ))}
                      {`${abonnemang.monthlyPrice - (abonnemang.monthlyDiscount ?? 0)} kr/mån`}
                    </div>
                  </div>
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}

export default OperatorPris
