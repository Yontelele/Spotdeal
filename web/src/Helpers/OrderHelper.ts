import { ContractType } from "../Enums/ContractType"

export const getContractTypeString = (contractType: ContractType): string => {
  switch (contractType) {
    case ContractType.Abonnemang:
      return "Abonnemang"
    case ContractType.Bredband:
      return "Bredband"
    case ContractType.TV:
      return "TV & Streaming"
    default:
      return "Okänd kontraktstyp"
  }
}
