import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { ArrowDownIcon } from "./Icons"
import { getUserRole } from "../../Helpers/UserHelper"
import { useUser } from "../../Hooks/useUser"
import { loginRedirect } from "../../Authorization/AuthConfig"
import { useQueryClient } from "@tanstack/react-query"
import { Fragment } from "react"
import UserAvatar from "./UserAvatar"

export const UserMenu = () => {
  const { user } = useUser()
  const queryClient = useQueryClient()

  function handleSwitchUser() {
    queryClient.clear()
    sessionStorage.clear()
    loginRedirect()
  }

  return (
    user && (
      <Menu as="div" className="relative inline-flex">
        <MenuButton className="inline-flex justify-center items-center group">
          <UserAvatar user={user} />
          <div className="flex items-center truncate">
            <span className="truncate ml-2.5 text-sm font-medium text-gray-100 group-hover:text-white">{`${user.firstName} ${user.lastName}`}</span>
            <ArrowDownIcon className="ml-2" />
          </div>
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
          <MenuItems className="origin-top-right z-10 absolute top-full right-0 min-w-44 bg-gray-800 border border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1">
            <MenuItem>
              <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-700/60">
                <div className="font-medium text-gray-100">{`${user.firstName} ${user.lastName}`}</div>
                <div className="text-xs text-gray-400 italic">{getUserRole(user.role)}</div>
              </div>
            </MenuItem>
            <MenuItem>
              <button onClick={handleSwitchUser} className="font-medium text-sm text-violet-500 hover:text-violet-400 flex items-center py-1 px-3">
                Byt användare
              </button>
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    )
  )
}

export default UserMenu
