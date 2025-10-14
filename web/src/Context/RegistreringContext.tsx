import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react"
import { ContractCodeListDto } from "../Models/ContractCodeListDto"

interface RegistreringContextProps {
  contractCodes: ContractCodeListDto[]
  setContractCodes: Dispatch<SetStateAction<ContractCodeListDto[]>>
}

interface RegistreringProviderProps {
  children: ReactNode
}

const RegistreringContext = createContext<RegistreringContextProps | undefined>(undefined)

const RegistreringProvider = ({ children }: RegistreringProviderProps) => {
  const [contractCodes, setContractCodes] = useState<ContractCodeListDto[]>([])

  const value: RegistreringContextProps = {
    contractCodes,
    setContractCodes,
  }

  return <RegistreringContext.Provider value={value}>{children}</RegistreringContext.Provider>
}

const useRegistreringContext = () => {
  const context = useContext(RegistreringContext)
  if (!context) throw new Error("useRegistreringContext must be used within an RegistreringProvider")

  return context
}

export { RegistreringProvider, useRegistreringContext }
