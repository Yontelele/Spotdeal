import { AbonnemangType } from "../Enums/AbonnemangType"
import { Bindningstider } from "../Enums/Bindningstider"
import { Operatorer } from "../Enums/Operatorer"

type GridConfig = Partial<Record<AbonnemangType | "default", string>>
type GridConfigBredbandTV = Partial<Record<Bindningstider | "default", string>>

const BASE_CLASSES = "mt-12 grid grid-cols-1 sm:gap-6"
const DEFAULT_GRID_CLASS = "sm:grid-cols-4"

const gridConfig: Record<Operatorer, GridConfig> = {
  [Operatorer.TELE2]: {
    [AbonnemangType.ExtraAnv]: "sm:grid-cols-6",
    default: "sm:grid-cols-5",
  },
  [Operatorer.HALEBOP]: {
    [AbonnemangType.Ungdom]: "sm:grid-cols-2",
    default: "sm:grid-cols-4",
  },
  [Operatorer.TELENOR]: {
    [AbonnemangType.ExtraAnv]: "sm:grid-cols-6",
    default: "sm:grid-cols-4",
  },
  [Operatorer.TELIA]: {
    [AbonnemangType.ExtraAnv]: "sm:grid-cols-2",
    [AbonnemangType.Ungdom]: "sm:grid-cols-5",
    default: "sm:grid-cols-6",
  },
  [Operatorer.TRE]: {
    [AbonnemangType.ExtraAnv]: "sm:grid-cols-2",
    default: "sm:grid-cols-3",
  },
}

const gridConfigBredband: Record<Operatorer, GridConfigBredbandTV> = {
  [Operatorer.TELE2]: {
    [Bindningstider.TOLV_MÅNADER_BINDNINGSTID]: "sm:grid-cols-3",
    default: "sm:grid-cols-4",
  },
  [Operatorer.TELENOR]: {
    [Bindningstider.INGEN_BINDNINGSTID]: "sm:grid-cols-2",
    default: "sm:grid-cols-3",
  },
  [Operatorer.TELIA]: {
    [Bindningstider.TJUGO_FYRA_MÅNADER_BINDNINGSTID]: "sm:grid-cols-1",
    default: "sm:grid-cols-4",
  },
  [Operatorer.TRE]: {
    default: "sm:grid-cols-2",
  },
  [Operatorer.HALEBOP]: {},
}

export const getGridAbonnemangRadioCards = (operator: Operatorer, selectedType: AbonnemangType): string => {
  const operatorConfig = gridConfig[operator] ?? { default: DEFAULT_GRID_CLASS }
  const gridClass = operatorConfig[selectedType] ?? operatorConfig.default ?? DEFAULT_GRID_CLASS
  return `${BASE_CLASSES} ${gridClass}`
}

export const getGridBredbandTVRadioCards = (operator: Operatorer, bindningstid: Bindningstider): string => {
  const operatorConfig = gridConfigBredband[operator] ?? { default: DEFAULT_GRID_CLASS }
  const gridClass = operatorConfig[bindningstid] ?? operatorConfig.default ?? DEFAULT_GRID_CLASS
  return `${BASE_CLASSES} ${gridClass}`
}
