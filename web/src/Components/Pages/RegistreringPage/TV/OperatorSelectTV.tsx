import { motion } from "framer-motion"
import { useOperator } from "../../../../Hooks/useOperator"
import Layout from "../../../Common/Layout"
import OperatorCard from "../OperatorCard"
import { Operatorer } from "../../../../Enums/Operatorer"

export const OperatorSelectTV = () => {
  const { operators } = useOperator()

  const filteredOperators = operators.filter((op) => op.id == Operatorer.TELE2 || op.id == Operatorer.TELIA)

  return (
    <Layout>
      <div className="py-24">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="mx-auto text-center">
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">Registrera TV & Streaming</p>
          </div>
          <p className="mx-auto mt-6 text-center text-lg leading-8 text-gray-300">Vänligen välj operatör och TV & Streaming paket</p>
          <motion.div
            className="grid grid-cols-2 gap-18 pt-8 sm:pt-16 lg:pt-32 px-4 sm:px-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredOperators.map((operator) => (
              <OperatorCard key={operator.id} operator={operator} />
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default OperatorSelectTV
