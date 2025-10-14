import { Operatorer } from "../Enums/Operatorer"

export type OperatorName = "TELE2" | "TRE" | "TELIA" | "TELENOR" | "HALEBOP"

export const getOperatorString = (id: number): string => {
  switch (id) {
    case Operatorer.TELE2:
      return "Tele2"
    case Operatorer.HALEBOP:
      return "Halebop"
    case Operatorer.TELENOR:
      return "Telenor"
    case Operatorer.TELIA:
      return "Telia"
    case Operatorer.TRE:
      return "Tre"
    default:
      return "Okänd operatör"
  }
}

export const isTeliaOrHalebop = (operatorId: number): boolean => {
  return operatorId === Operatorer.HALEBOP || operatorId === Operatorer.TELIA
}
