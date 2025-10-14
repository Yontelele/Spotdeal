import { ReactNode } from "react"

interface Props {
  titel: string
  children?: ReactNode
}

export const HeaderPage = ({ titel, children }: Props) => (
  <div className="sm:flex sm:justify-between sm:items-center mb-8">
    <div className="mb-4 sm:mb-0">
      <h1 className="text-2xl md:text-3xl text-gray-100 font-bold">{titel}</h1>
    </div>
    <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">{children}</div>
  </div>
)

export default HeaderPage
