import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { Fragment } from "react/jsx-runtime"
import { HelpIcon } from "./Icons"

export const Help = () => {
  return (
    <Menu as="div" className="relative inline-flex">
      <MenuButton className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-400 hover:bg-gray-700/50 transition-all duration-200">
        <HelpIcon />
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
          <div className="text-xs font-semibold text-gray-500 uppercase pt-1.5 pb-2 px-3">Behövs hjälp?</div>
          <MenuItem>
            <button className="font-medium text-sm text-violet-500 hover:text-violet-400 flex items-center py-1 px-3">
              <svg className="w-3 h-3 fill-current text-violet-500 shrink-0 mr-2" viewBox="0 0 12 12">
                <path d="M10.5 0h-9A1.5 1.5 0 000 1.5v9A1.5 1.5 0 001.5 12h9a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 0zM10 7L8.207 5.207l-3 3-1.414-1.414 3-3L5 2h5v5z" />
              </svg>
              <span>Kontakta support</span>
            </button>
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  )
}

export default Help
