import { AbonnemangType } from "../Enums/AbonnemangType"
import { AbonnemangDto } from "../Models/AbonnemangDto"
import { AbonnemangInCart } from "../Models/CartDto"
import { ContractDto } from "../Models/ContractDto"
import { OperatorName } from "./OperatorHelper"

const AbonnemanFilter = {
  TELE2: {
    Nyteck: (abonnemang: AbonnemangDto) => abonnemang.isHuvudAbonnemang && !abonnemang.isBefintligtAbonnemang,
    Befintlig: (abonnemang: AbonnemangDto) => abonnemang.isHuvudAbonnemang && abonnemang.isBefintligtAbonnemang,
    ExtraAnv: (abonnemang: AbonnemangDto) => !abonnemang.isHuvudAbonnemang,
    Ungdom: null,
  },
  TRE: {
    Nyteck: (abonnemang: AbonnemangDto) => abonnemang.isHuvudAbonnemang && !abonnemang.isBefintligtAbonnemang,
    Befintlig: (abonnemang: AbonnemangDto) => abonnemang.isHuvudAbonnemang && abonnemang.isBefintligtAbonnemang,
    ExtraAnv: (abonnemang: AbonnemangDto) => !abonnemang.isHuvudAbonnemang,
    Ungdom: null,
  },
  TELIA: {
    Nyteck: (abonnemang: AbonnemangDto) =>
      abonnemang.isHuvudAbonnemang && !abonnemang.isBefintligtAbonnemang && !abonnemang.isForDelbetalningOnly && !abonnemang.isUngdomsAbonnemang,
    Befintlig: (abonnemang: AbonnemangDto) => abonnemang.isHuvudAbonnemang && abonnemang.isBefintligtAbonnemang && !abonnemang.isUngdomsAbonnemang,
    ExtraAnv: (abonnemang: AbonnemangDto) => !abonnemang.isHuvudAbonnemang && !abonnemang.isForDelbetalningOnly,
    Ungdom: (abonnemang: AbonnemangDto) => abonnemang.isUngdomsAbonnemang && !abonnemang.isForDelbetalningOnly,
  },
  TELENOR: {
    Nyteck: (abonnemang: AbonnemangDto) => abonnemang.isHuvudAbonnemang && !abonnemang.isBefintligtAbonnemang && !abonnemang.isForDelbetalningOnly,
    Befintlig: (abonnemang: AbonnemangDto) => abonnemang.isHuvudAbonnemang && abonnemang.isBefintligtAbonnemang && !abonnemang.isForDelbetalningOnly,
    ExtraAnv: (abonnemang: AbonnemangDto) => !abonnemang.isHuvudAbonnemang && !abonnemang.isForDelbetalningOnly,
    Ungdom: null,
  },
  HALEBOP: {
    Nyteck: (abonnemang: AbonnemangDto) =>
      abonnemang.isHuvudAbonnemang && !abonnemang.isBefintligtAbonnemang && !abonnemang.isForDelbetalningOnly && !abonnemang.isUngdomsAbonnemang,
    Befintlig: (abonnemang: AbonnemangDto) => abonnemang.isHuvudAbonnemang && abonnemang.isBefintligtAbonnemang && !abonnemang.isUngdomsAbonnemang,
    ExtraAnv: (abonnemang: AbonnemangDto) => !abonnemang.isHuvudAbonnemang && !abonnemang.isForDelbetalningOnly,
    Ungdom: (abonnemang: AbonnemangDto) => abonnemang.isUngdomsAbonnemang && !abonnemang.isForDelbetalningOnly,
  },
}

export const filterAbonnemangByType = (regButton: AbonnemangType, operator: OperatorName, abonnemang: AbonnemangDto[]) => {
  const operatorFilters = AbonnemanFilter[operator]
  let filteredAbb = []

  switch (regButton) {
    case AbonnemangType.Nyteck:
      filteredAbb = abonnemang.filter((prisplan) => operatorFilters.Nyteck(prisplan))
      break
    case AbonnemangType.Befintlig:
      filteredAbb = abonnemang.filter((prisplan) => operatorFilters.Befintlig(prisplan))
      break
    case AbonnemangType.ExtraAnv:
      filteredAbb = abonnemang.filter((prisplan) => operatorFilters.ExtraAnv(prisplan))
      break
    case AbonnemangType.Ungdom:
      filteredAbb = operatorFilters.Ungdom ? abonnemang.filter((prisplan) => operatorFilters.Ungdom(prisplan)) : []
      break
    default:
      return []
  }

  return filteredAbb
}

export const getAbonnemangMonthlyCost = (abonnemang: AbonnemangInCart | AbonnemangDto | ContractDto): number => {
  const monthlyPrice = abonnemang.monthlyPrice ?? 0
  return abonnemang.monthlyDiscount ? monthlyPrice - abonnemang.monthlyDiscount : monthlyPrice
}
