import { Fragment } from "react"
import { useOperator } from "../../../Hooks/useOperator"
import HeaderPage from "../../Common/HeaderPage"
import Layout from "../../Common/Layout"
import OperatorPris from "./OperatorPris"
import OperatorRabatt from "./OperatorRabatt"

export const Operatorspriser = () => {
  const { operators } = useOperator()

  return (
    <Layout>
      <HeaderPage titel="Operatörspriser" />
      <div className="grid grid-cols-12 gap-6">
        {operators.map((operator) => (
          <Fragment key={operator.id}>
            <OperatorPris operator={operator} />
            <OperatorRabatt operator={operator} />
          </Fragment>
        ))}
      </div>
    </Layout>
  )
}

export default Operatorspriser
