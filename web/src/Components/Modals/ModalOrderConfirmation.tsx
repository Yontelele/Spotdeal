import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { CheckIcon, DocumentTextIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { motion, AnimatePresence } from "framer-motion"
import { MODAL_ORDER_CONFIRMATION } from "../../Helpers/ModalHelper"
import { useAppContext } from "../../Context/AppContext"
import { useUser } from "../../Hooks/useUser"
import { RouteNames } from "../../Enums/RouteNames"

interface Props {
  orderId: number | null
}

export const ModalOrderConfirmation = ({ orderId }: Props) => {
  const { navigate, handleShowModal, isModalOpen } = useAppContext()
  const { user } = useUser()

  return (
    <Dialog open={isModalOpen(MODAL_ORDER_CONFIRMATION)} onClose={() => handleShowModal(MODAL_ORDER_CONFIRMATION)} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <AnimatePresence>
            {isModalOpen(MODAL_ORDER_CONFIRMATION) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md"
              >
                <DialogPanel className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 px-6 pb-6 pt-5 text-left shadow-2xl border border-gray-800">
                  <button
                    onClick={() => handleShowModal(MODAL_ORDER_CONFIRMATION)}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg shadow-green-500/20">
                      <CheckIcon className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="mt-5 text-center"
                  >
                    <DialogTitle as="h3" className="text-xl font-bold text-white">
                      Ordern är registrerad!
                    </DialogTitle>

                    <div className="mt-3">
                      <p className="text-base text-gray-200">
                        Snyggt jobbat, <span className="font-semibold text-emerald-400">{user ? user.firstName : "säljare"}</span>! 🎉
                      </p>
                    </div>
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.3 }} className="mt-6">
                    <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700 mb-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-blue-400 mr-2" />
                          <span className="text-sm font-medium text-gray-200">Ordernummer</span>
                        </div>
                        <span className="text-sm font-mono bg-gray-900/50 px-3 py-1 rounded-md text-blue-300">#{orderId}</span>
                      </div>
                    </div>

                    <div className=" ">
                      <motion.button
                        type="button"
                        className="btn w-full bg-gray-100 text-gray-800 hover:bg-white"
                        onClick={() => {
                          handleShowModal(MODAL_ORDER_CONFIRMATION)
                          navigate(RouteNames.RegistreraAbonnemangPage)
                        }}
                      >
                        Gå tillbaka till översikt
                      </motion.button>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.3 }} className="mt-4 text-center">
                      <p className="text-xs text-gray-400">Ordern är nu synlig i systemet och kommer att behandlas automatiskt</p>
                    </motion.div>
                  </motion.div>
                </DialogPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Dialog>
  )
}

export default ModalOrderConfirmation
