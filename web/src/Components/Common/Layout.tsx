import { ReactNode } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
