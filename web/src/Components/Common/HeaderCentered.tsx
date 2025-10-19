import { ReactNode } from "react"

interface Props {
  titel: string
  subtitle: string
  children: ReactNode
}

export const HeaderCenter = ({ titel, subtitle, children }: Props) => (
  <div className="py-24">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">{titel}</p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">{subtitle}</p>
      {children}
    </div>
  </div>
)

export default HeaderCenter
