import { HomeIcon, CurrencyDollarIcon, DevicePhoneMobileIcon, BuildingOffice2Icon, ClipboardDocumentListIcon } from "@heroicons/react/24/solid"
import { NavLink, useLocation } from "react-router-dom"
import { ElementType, Fragment, ReactNode, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SpotdealLogo from "../../Assets/48x48background.png"
import { ArrowDownIcon, CollapseAndExpandSidebarIcon } from "./Icons"
import { useAppContext } from "../../Context/AppContext"
import { RouteNames } from "../../Enums/RouteNames"

const SidebarGroup = ({ children, activecondition }: { children: (handleClick: () => void, open: boolean) => ReactNode; activecondition: boolean }) => {
  const { setSidebarGroupOpen, sidebarGroupOpen, setSidebarOpen, sidebarOpen } = useAppContext()

  function handleClick() {
    if (!sidebarOpen) {
      setSidebarOpen(true)
      setSidebarGroupOpen(true)
    } else setSidebarGroupOpen(!sidebarGroupOpen)
  }

  return (
    <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-gradient-to-br ${activecondition && "from-violet-500/24 to-violet-500/4"}`}>
      {children(handleClick, sidebarGroupOpen)}
    </li>
  )
}

const SidebarGroupItem = ({ to, label }: { to: string; label: string }) => {
  const { pathname } = useLocation()
  const isActive = pathname.startsWith(to)

  return (
    <li className="mb-1 last:mb-0">
      <NavLink to={to} className={`block transition duration-150 truncate ${isActive ? "text-violet-500" : "text-gray-400 hover:text-gray-200"}`}>
        <span className="text-sm font-medium duration-200">{label}</span>
      </NavLink>
    </li>
  )
}

const SidebarItem = ({
  to,
  icon: Icon,
  label,
  pathMatch = "exact",
  startsWith = "",
}: {
  to: string
  icon: ElementType
  label: string
  pathMatch?: "exact" | "startsWith"
  startsWith?: string
}) => {
  const { pathname } = useLocation()

  const isActive = () => {
    if (pathMatch === "startsWith") return pathname.startsWith(startsWith)
    else return pathname === to
  }

  return (
    <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-gradient-to-br ${isActive() && "from-violet-500/24 to-violet-500/4"}`}>
      <NavLink end to={to} className="block text-gray-100 truncate transition duration-150 hover:text-gray-50">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 shrink-0 ${isActive() ? "text-violet-500" : "text-gray-500"}`} />
          <span className="text-sm font-medium ml-3 duration-200">{label}</span>
        </div>
      </NavLink>
    </li>
  )
}

const SectionHeading = ({ label, sidebarOpen }: { label: string; sidebarOpen: boolean }) => (
  <h3 className="text-xs text-gray-500 font-semibold pl-3">
    <span className={`${!sidebarOpen ? "block" : "hidden"} 2xl:hidden text-center w-6`}>•••</span>
    <span className={`${sidebarOpen ? "block" : "hidden"} 2xl:block`}>{label}</span>
  </h3>
)

export const Sidebar = () => {
  const { setSidebarOpen, sidebarOpen } = useAppContext()
  const { pathname } = useLocation()
  const [skipInitialAnimation, setSkipInitialAnimation] = useState(true)

  const isDashboardActive = pathname.startsWith("/registrer")

  useEffect(() => {
    setSkipInitialAnimation(false)
  }, [])

  return (
    <div className="min-w-fit">
      <div
        id="sidebar"
        className={`flex flex-col absolute z-40 left-0 top-0 static h-[100dvh] overflow-y-scroll transition-all duration-200 ease-in-out ${
          sidebarOpen ? "w-64" : "w-20"
        } 2xl:!w-64 rounded-r-2xl shadow-sm bg-gray-800 p-4`}
      >
        <div className="mb-6">
          <NavLink end to={RouteNames.RegistreraAbonnemangPage} className="block">
            <img src={SpotdealLogo} className="w-12 h-12 shrink-0" />
          </NavLink>
        </div>

        <div className="space-y-8">
          <div>
            <SectionHeading label="FÖRSÄLJNING" sidebarOpen={sidebarOpen} />
            <ul className="mt-3">
              <SidebarGroup activecondition={isDashboardActive}>
                {(handleClick, open) => (
                  <Fragment>
                    <button
                      type="button"
                      className={`block w-full text-gray-100 truncate transition duration-150 ${isDashboardActive ? "" : "hover:text-gray-50"}`}
                      onClick={() => handleClick()}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <HomeIcon className={`h-5 w-5 shrink-0 ${isDashboardActive ? "text-violet-500" : "text-gray-500"}`} />
                          <span className="text-sm font-medium ml-3 duration-200">Registrera</span>
                        </div>
                        <div className="flex shrink-0 ml-2">
                          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: skipInitialAnimation ? 0 : 0.3, ease: "easeInOut" }}>
                            <ArrowDownIcon className="ml-1" />
                          </motion.div>
                        </div>
                      </div>
                    </button>
                    <div className={`${sidebarOpen ? "block" : "hidden"} 2xl:block`}>
                      <AnimatePresence>
                        {open && (
                          <motion.ul
                            className="pl-8 mt-1 overflow-hidden"
                            initial={skipInitialAnimation ? false : { height: 0, opacity: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: "easeInOut",
                              opacity: { duration: 0.2 },
                            }}
                          >
                            <SidebarGroupItem to={RouteNames.RegistreraAbonnemangPage} label="Abonnemang" />
                            <SidebarGroupItem to={RouteNames.RegistreraBredbandPage} label="Bredband" />
                            <SidebarGroupItem to={RouteNames.RegistreraTvPage} label="TV & Streaming" />
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </Fragment>
                )}
              </SidebarGroup>

              <SidebarItem to={RouteNames.MobilDealPage} icon={DevicePhoneMobileIcon} label="Mobildeals" />
              <SidebarItem to={RouteNames.LathundPage} icon={CurrencyDollarIcon} label="Operatörspriser" />
            </ul>
          </div>

          <div>
            <SectionHeading label="ÖVERSIKT" sidebarOpen={sidebarOpen} />
            <ul className="mt-3">
              <SidebarItem to={RouteNames.VaruhusPage} icon={BuildingOffice2Icon} label="Varuhus" />
              <SidebarItem to={RouteNames.OrdrarPage} icon={ClipboardDocumentListIcon} label="Orderhistorik" pathMatch="startsWith" startsWith="/ord" />
            </ul>
          </div>
        </div>

        <div className="pt-3 flex justify-end mt-auto">
          <div className="w-12 pl-4 pr-3 py-2">
            <button className="text-gray-500 block 2xl:hidden text-center w-6" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <CollapseAndExpandSidebarIcon rotate={sidebarOpen} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
