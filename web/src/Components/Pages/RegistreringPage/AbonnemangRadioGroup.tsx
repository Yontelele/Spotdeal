import { Fragment } from "react"
import { RadioGroup, Radio, Label } from "@headlessui/react"
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid"
import { OperatorDto } from "../../../Models/OperatorDto"
import { useCartContext } from "../../../Context/CartContext"
import { OperatorName } from "../../../Helpers/OperatorHelper"
import { getGridAbonnemangRadioCards } from "../../../Helpers/GridHelper"
import { filterAbonnemangByType } from "../../../Helpers/AbonnemangHelper"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  selectedOperator: OperatorDto
  removeAbonnemangFromCartWithButton: () => void
  addAbonnemangToCartWithButton: () => void
}

export const AbonnemangRadioGroup = ({ selectedOperator, removeAbonnemangFromCartWithButton, addAbonnemangToCartWithButton }: Props) => {
  const { state, selectHuvudAbonnemang, abonnemang } = useCartContext()
  const { selectedAbonnemangType, selectedHuvudAbonnemang, cart } = state
  const { abonnemangCart } = cart

  return (
    <RadioGroup value={selectedHuvudAbonnemang} onChange={(newHuvud) => selectHuvudAbonnemang(newHuvud)}>
      <div className={getGridAbonnemangRadioCards(selectedOperator.id, selectedAbonnemangType)}>
        {filterAbonnemangByType(selectedAbonnemangType, selectedOperator.name as OperatorName, abonnemang).map((abonnemang) => (
          <Radio
            key={abonnemang.id}
            value={abonnemang}
            className={`relative flex flex-col items-center cursor-pointer rounded-lg border bg-gray-800 p-4 shadow-sm focus:outline-hidden ${
              selectedHuvudAbonnemang?.name === abonnemang.name
                ? "border-violet-600 ring-1 ring-violet-600"
                : "border-gray-700 hover:border-gray-600 transition-colors"
            }`}
          >
            {({ checked }) => (
              <Fragment>
                <div className="w-16 h-11 shrink-0 -mt-4">
                  <img src={selectedOperator.logoUrl} />
                </div>
                <Label className="block font-semibold text-gray-100 text-center mt-5">{abonnemang.registrationName}</Label>

                <form className="max-w-xs mx-auto mt-3">
                  <div className={`relative flex items-center ${!checked ? "invisible" : ""}`}>
                    <button
                      type="button"
                      onClick={removeAbonnemangFromCartWithButton}
                      className={`rounded-full p-1.5 text-white shadow-sm  ${
                        abonnemangCart.length <= 1
                          ? "bg-gray-500"
                          : "bg-violet-600 hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                      }`}
                      disabled={abonnemangCart.length <= 1}
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                    <div className="relative w-10 h-6 mx-1 overflow-hidden">
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={abonnemangCart.length}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="shrink-0 text-white text-sm font-normal text-center">{abonnemangCart.length}</span>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <button
                      type="button"
                      onClick={addAbonnemangToCartWithButton}
                      className={`rounded-full p-1.5 text-white shadow-sm  ${
                        abonnemangCart.length >= 10
                          ? "bg-gray-500"
                          : "bg-violet-600 hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                      }`}
                      disabled={abonnemangCart.length >= 10}
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </Fragment>
            )}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  )
}

export default AbonnemangRadioGroup
