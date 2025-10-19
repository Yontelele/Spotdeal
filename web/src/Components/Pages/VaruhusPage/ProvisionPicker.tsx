import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { Dispatch, Fragment, SetStateAction } from "react"
import { FilterIcon } from "../../Common/Icons"

interface Props {
  provisionMultiplier: number
  setProvisionMultiplier: Dispatch<SetStateAction<number>>
}

export const ProvisionPicker = ({ provisionMultiplier, setProvisionMultiplier }: Props) => {
  const multipliers = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5]

  return (
    <Menu as="div" className="relative inline-flex">
      <MenuButton className="btn px-2.5! bg-gray-800 border-gray-700/60 hover:border-gray-600 text-gray-500">
        <FilterIcon />
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
        <MenuItems className="origin-top-right z-10 absolute top-full left-auto right-0 min-w-56 bg-gray-800 border border-gray-700/60 pt-1.5 rounded-lg shadow-lg overflow-hidden mt-1 md:left-auto md:right-0">
          {() => (
            <>
              <div className="text-xs font-semibold text-gray-500 uppercase pt-1.5 pb-2 px-3">Provision Trend</div>
              <ul className="mb-4">
                {multipliers.map((multiplier) => (
                  <li className="py-1 px-3" key={multiplier}>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        value={multiplier}
                        checked={provisionMultiplier === multiplier}
                        onChange={() => setProvisionMultiplier(multiplier)}
                      />
                      <span className="text-sm font-medium ml-2">{multiplier}x</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="py-2 px-3 border-t border-gray-700/60 bg-gray-700/20">
                <ul className="flex items-center justify-between">
                  <li>
                    <button onClick={() => setProvisionMultiplier(1)} className="btn-xs bg-gray-800 border-gray-700/60 hover:border-gray-600 text-red-500">
                      Nollställ
                    </button>
                  </li>
                  <li>
                    <MenuItem>
                      {({ close }) => (
                        <button className="btn-xs bg-gray-800 border-gray-700/60 hover:border-gray-600 text-gray-300" onClick={() => close()}>
                          Stäng
                        </button>
                      )}
                    </MenuItem>
                  </li>
                </ul>
              </div>
            </>
          )}
        </MenuItems>
      </Transition>
    </Menu>
  )
}

export default ProvisionPicker
