import { useEffect, useState } from "react"
import { usePhoneContext } from "../../../Context/PhoneContext"
import { ToastConfig } from "../../../Helpers/ToastHelper"
import { useMobilDeal } from "../../../Hooks/useMobilDeal"
import { MobilDealDto } from "../../../Models/MobilDealDto"
import { PhoneDto } from "../../../Models/PhoneDto"
import HeaderCenter from "../../Common/HeaderCentered"
import { SearchIconBig, SearchIconSmall } from "../../Common/Icons"
import Layout from "../../Common/Layout"
import toast from "react-hot-toast"
import MobilDealResult from "./MobilDealResult"
import { useDebounce } from "../../../Hooks/useDebounce"
import { motion, AnimatePresence } from "framer-motion"
import { staggerItems, listItem, fadeIn } from "../../../Helpers/MotionHelper"

export const MobilDeal = () => {
  const { state, setPhoneSearch, selectPhone, findPhoneSearchResults } = usePhoneContext()
  const { selectedPhone, phoneSearch } = state

  const debouncedPhoneSearch = useDebounce(phoneSearch, 200)
  const searchResults = findPhoneSearchResults(debouncedPhoneSearch)
  const mutation = useMobilDeal()

  const [mobildeal, setMobildeal] = useState<MobilDealDto | null>(null)

  useEffect(() => {
    return () => {
      setPhoneSearch("")
      selectPhone(null)
      setMobildeal(null)
    }
  }, [])

  function handleGetMobilDeal(phone: PhoneDto) {
    selectPhone(phone)
    setMobildeal(null)

    mutation.mutate(phone.id, {
      onError: (error) => toast.error(error.message || "Misslyckades att hämta mobildeal. Försök igen.", ToastConfig),
      onSuccess: (mobildeal: MobilDealDto) => {
        setMobildeal(mobildeal)
      },
    })
  }

  return (
    <Layout>
      <HeaderCenter titel="Hitta den bästa mobildealen just nu" subtitle="Välj telefon och upptäck de bästa erbjudanden">
        <div className="flex justify-center mt-11 gap-3">
          <div className="bg-gray-800 border border-gray-700/60 overflow-auto max-w-2xl w-full max-h-full rounded-lg shadow-lg">
            <div className="relative">
              <input
                className="w-full text-gray-300 bg-gray-800 border-0 focus:ring-transparent focus:outline-hidden focus:border-gray-700/60 placeholder-gray-500 appearance-none py-3 pl-10 pr-4 border-b border-gray-700/60"
                type="search"
                placeholder="Sök efter telefon..."
                onChange={(e) => {
                  setPhoneSearch(e.target.value)
                  selectPhone(null)
                  setMobildeal(null)
                }}
                value={phoneSearch}
              />
              <button disabled className="absolute inset-0 right-auto group" type="submit">
                <SearchIconBig className="shrink-0 fill-current text-gray-500 ml-3.5 mr-2" />
              </button>
            </div>
            {debouncedPhoneSearch.length > 0 && !selectedPhone && (
              <div className="py-4 px-2">
                <div className="mb-3 last:mb-0">
                  <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Matchande resultat</div>
                  <AnimatePresence>
                    <motion.ul
                      className="text-sm max-h-[19rem] overflow-y-auto !scrollbar-thin !scrollbar-thumb-gray-400/70 !scrollbar-track-gray-800 !scrollbar-thumb-rounded-full !scrollbar-track-rounded-lg rounded-lg"
                      variants={staggerItems}
                      initial="hidden"
                      animate="visible"
                    >
                      {searchResults.length > 0 ? (
                        searchResults.map((phone) => (
                          <motion.li key={phone.id} variants={listItem}>
                            <button
                              className="flex w-full items-center p-2 text-gray-100 hover:bg-gray-700/20 rounded-lg"
                              onClick={() => handleGetMobilDeal(phone)}
                            >
                              <SearchIconSmall className="fill-current text-gray-500 shrink-0 mr-3" />
                              <span>
                                {phone.brand} {phone.model} {phone.storage}
                              </span>
                            </button>
                          </motion.li>
                        ))
                      ) : (
                        <motion.li className="text-gray-500 text-center py-2" variants={fadeIn}>
                          Inga resultat hittades för <i className="text-gray-400">{debouncedPhoneSearch}</i>.
                        </motion.li>
                      )}
                    </motion.ul>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
        <MobilDealResult mobildeal={mobildeal} />
      </HeaderCenter>
    </Layout>
  )
}

export default MobilDeal
