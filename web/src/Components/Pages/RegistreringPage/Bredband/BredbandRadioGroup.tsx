import { useCartContext } from "../../../../Context/CartContext"
import { Fragment } from "react"
import { getGridBredbandTVRadioCards } from "../../../../Helpers/GridHelper"
import { OperatorDto } from "../../../../Models/OperatorDto"
import { RadioGroup, Radio, Label } from "@headlessui/react"
import { Bindningstider } from "../../../../Enums/Bindningstider"
import { BredbandDto } from "../../../../Models/BredbandDto"
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid"
import { AnimatePresence, motion } from "framer-motion"

const filterByBindningstid = (bindningstid: Bindningstider, bredband: BredbandDto[]) => {
  let filteredBredband = []

  switch (bindningstid) {
    case Bindningstider.INGEN_BINDNINGSTID:
      filteredBredband = bredband.filter((b) => b.bindningstid == 0)
      break
    case Bindningstider.TOLV_MÅNADER_BINDNINGSTID:
      filteredBredband = bredband.filter((b) => b.bindningstid == 12)
      break
    case Bindningstider.TJUGO_FYRA_MÅNADER_BINDNINGSTID:
      filteredBredband = bredband.filter((b) => b.bindningstid == 24)
      break
    default:
      return []
  }

  return filteredBredband
}

interface Props {
  selectedOperator: OperatorDto
}

export const BredbandRadioGroup = ({ selectedOperator }: Props) => {
  const { state, selectBredband, bredband } = useCartContext()
  const { selectedBindningstid, selectedBredband } = state

  return (
    <RadioGroup value={selectedBredband} onChange={(newBredband) => selectBredband(newBredband)}>
      <div className={getGridBredbandTVRadioCards(selectedOperator.id, selectedBindningstid)}>
        {filterByBindningstid(selectedBindningstid, bredband).map((bredband) => (
          <Radio
            key={bredband.id}
            value={bredband}
            className={`relative flex flex-col items-center cursor-pointer rounded-lg border bg-gray-800 p-4 shadow-sm focus:outline-hidden ${
              selectedBredband?.name === bredband.name ? "border-violet-600 ring-1 ring-violet-600" : "border-gray-700 hover:border-gray-600 transition-colors"
            }`}
          >
            {({ checked }) => (
              <Fragment>
                <div className="w-16 h-11 shrink-0 -mt-4">
                  <img src={selectedOperator.logoUrl} />
                </div>
                <Label className="block font-semibold text-gray-100 text-center mt-5">{bredband.registrationName}</Label>

                <form className="max-w-xs mx-auto mt-3">
                  <div className={`relative flex items-center ${!checked ? "invisible" : ""}`}>
                    <button type="button" className={`rounded-full p-1.5 text-white shadow-sm bg-gray-500`} disabled>
                      <MinusIcon className="h-5 w-5" />
                    </button>
                    <div className="relative w-10 h-6 mx-1 overflow-hidden">
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={selectedBredband?.operatorId}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="shrink-0 text-white text-sm font-normal text-center">1</span>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <button type="button" className={`rounded-full p-1.5 text-white shadow-sm bg-gray-500`} disabled>
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

export default BredbandRadioGroup
