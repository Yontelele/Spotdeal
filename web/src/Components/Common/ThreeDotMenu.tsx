import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react"
import { Fragment, ReactNode } from "react"
import { ThreeDotMenuIcon } from "./Icons"

interface Props {
  children: ReactNode
}

export const ThreeDotMenu = ({ children }: Props) => (
  <Menu as="div" className="relative inline-flex">
    <MenuButton className="rounded-full text-gray-500 hover:text-gray-400 hover:bg-gray-700/60 transition-all duration-200">
      <ThreeDotMenuIcon />
    </MenuButton>

    <Transition
      as={Fragment}
      enter="transition ease-out duration-200 transform"
      enterFrom="opacity-0 -translate-y-2"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-out duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <MenuItems className="origin-top-right z-10 absolute top-full min-w-44 bg-gray-800 border border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 right-0">
        {children}
      </MenuItems>
    </Transition>
  </Menu>
)

export default ThreeDotMenu
