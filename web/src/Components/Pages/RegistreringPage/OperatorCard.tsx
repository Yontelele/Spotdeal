import { NavLink, useLocation } from "react-router-dom"
import { OperatorDto } from "../../../Models/OperatorDto"
import { toLowerCase, capitalizeFirstLetter } from "../../../Helpers/StringHelper"
import { useCartContext } from "../../../Context/CartContext"
import { ContractType } from "../../../Enums/ContractType"
import { RouteNames } from "../../../Enums/RouteNames"

interface Props {
  operator: OperatorDto
}

export const OperatorCard = ({ operator }: Props) => {
  const { selectOperator } = useCartContext()
  const location = useLocation()

  const getContractTypeFromParams = () => {
    switch (location.pathname) {
      case RouteNames.RegistreraAbonnemangPage:
        return ContractType.Abonnemang
      case RouteNames.RegistreraBredbandPage:
        return ContractType.Bredband
      case RouteNames.RegistreraTvPage:
        return ContractType.TV
      default:
        return ContractType.Abonnemang
    }
  }

  return (
    <NavLink
      end
      to={`${location.pathname}/${toLowerCase(operator.name)}`}
      className="flex flex-col p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm sm:p-6 lg:p-8 hover:border-gray-600 transition-colors"
      onClick={() => selectOperator(operator, getContractTypeFromParams())}
    >
      <div className="relative aspect-square w-full">
        <img src={operator.logoUrl} className="w-full h-full object-contain" />
      </div>
      <div className="text-xl font-bold text-center leading-none text-gray-100">{capitalizeFirstLetter(operator.name)}</div>
    </NavLink>
  )
}

export default OperatorCard
