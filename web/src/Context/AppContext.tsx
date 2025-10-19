import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

interface ContextProps {
  navigate: NavigateFunction
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  sidebarGroupOpen: boolean
  setSidebarGroupOpen: Dispatch<SetStateAction<boolean>>
  handleShowModal: (modalId: string) => void
  isModalOpen: (modalId: string) => boolean
}

interface ProviderProps {
  children: ReactNode
}

const AppContext = createContext<ContextProps | undefined>(undefined)

const AppProvider: FC<ProviderProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [sidebarGroupOpen, setSidebarGroupOpen] = useState<boolean>(true)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleShowModal = (modalId: string) => setActiveModal((prev) => (prev === modalId ? null : modalId))
  const isModalOpen = (modalId: string) => activeModal === modalId

  const value: ContextProps = {
    navigate,
    sidebarOpen,
    setSidebarOpen,
    sidebarGroupOpen,
    setSidebarGroupOpen,
    handleShowModal,
    isModalOpen,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("useAppContext must be used within an AppProvider")
  return context
}

export { AppProvider, useAppContext }
