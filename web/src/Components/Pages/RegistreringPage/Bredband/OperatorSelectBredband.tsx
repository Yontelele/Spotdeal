import { motion } from "framer-motion"
import { useOperator } from "../../../../Hooks/useOperator"
import Layout from "../../../Common/Layout"
import OperatorCard from "../OperatorCard"
import { Operatorer } from "../../../../Enums/Operatorer"

export const OperatorSelectBredband = () => {
  const { operators } = useOperator()

  const filteredOperators = operators.filter((op) => op.id !== Operatorer.HALEBOP)

  return (
    <Layout>
      <div className="py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">Registrera ett nytt bredband</p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">Vänligen välj operatör och bredband</p>
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-12 pt-8 sm:pt-16 lg:pt-32 px-4 sm:px-0"
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

export default OperatorSelectBredband
