import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import { Fragment, ReactNode } from "react"

type Props = {
  modalTitel: string
  modalDescriptionText: ReactNode
  modalDeleteButtonText: string
  open: boolean
  close: () => void
  onDelete: () => void
}

export const ModalDelete = ({ modalTitel, modalDescriptionText, modalDeleteButtonText, open, close, onDelete }: Props) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" onClose={close} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-900/40" />
        </TransitionChild>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-end justify-center p-4 text-left sm:items-center">
            <TransitionChild
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="w-full max-w-lg relative transform overflow-hidden rounded-lg bg-gray-800 border border-gray-700/60 text-left shadow-xl">
                <div className="bg-gray-800 px-4 pb-2 pt-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-700 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-left ml-5">
                      <DialogTitle className="font-semibold text-gray-100 text-lg">{modalTitel}</DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-400">{modalDescriptionText}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end space-x-2 px-4 pb-3 pt-1">
                  <button onClick={close} className="btn-sm border-gray-700/60 hover:border-gray-600 text-gray-300">
                    Avbryt
                  </button>
                  <button onClick={() => onDelete()} className="btn-sm bg-red-500 border-red-500! hover:bg-red-600 text-white">
                    {modalDeleteButtonText}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalDelete
