import { Transition } from "@headlessui/react"
import { ReactNode, useState } from "react"
import { TooltipIcon } from "./Icons"

type Props = {
  children: ReactNode
  className?: string
  size?: string
  position?: string
}

export const Tooltip = ({ children, className, size, position }: Props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const positionOuterClasses = (position: string | undefined) => {
    switch (position) {
      case "right":
        return "left-full top-1/2 -translate-y-1/2"
      case "left":
        return "right-full top-1/2 -translate-y-1/2"
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2"
      default:
        return "bottom-full left-1/2 -translate-x-1/2"
    }
  }

  const sizeClasses = (size: string | undefined) => {
    switch (size) {
      case "lg":
        return "min-w-72 px-3 py-2"
      case "md":
        return "min-w-56 px-3 py-2"
      case "sm":
        return "min-w-44 px-3 py-2"
      default:
        return "px-3 py-2"
    }
  }

  const positionInnerClasses = (position: string | undefined) => {
    switch (position) {
      case "right":
        return "ml-2"
      case "left":
        return "mr-2"
      case "bottom":
        return "mt-2"
      default:
        return "mb-2"
    }
  }

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
      onFocus={() => setTooltipOpen(true)}
      onBlur={() => setTooltipOpen(false)}
    >
      <button className="block" onClick={(e) => e.preventDefault()}>
        <TooltipIcon />
      </button>
      <div className={`z-10 absolute ${positionOuterClasses(position)}`}>
        <Transition
          show={tooltipOpen}
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`rounded-lg border overflow-hidden shadow-lg bg-gray-800 text-gray-100 border-gray-700/60 ${sizeClasses(size)} ${positionInnerClasses(
              position
            )}`}
          >
            {children}
          </div>
        </Transition>
      </div>
    </div>
  )
}

export default Tooltip
