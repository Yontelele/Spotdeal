import { useOperator } from "../../../Hooks/useOperator"
import { motion } from "framer-motion"
import OperatorCard from "./OperatorCard"
import HeaderCenter from "../../Common/HeaderCentered"
import Layout from "../../Common/Layout"

export const OperatorSelect = () => {
  const { operators } = useOperator()

  return (
    <Layout>
      <HeaderCenter titel="Registrera ett nytt abonnemang" subtitle="Vänligen välj operatör och abonnemangsplan">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-8 sm:pt-16 lg:pt-32 px-4 sm:px-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {operators.map((operator) => (
            <OperatorCard key={operator.id} operator={operator} />
          ))}
        </motion.div>
      </HeaderCenter>
    </Layout>
  )
}

export default OperatorSelect
