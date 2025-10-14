import { useState } from "react"
import { useDashboard } from "../../../Hooks/useDashboard"
import { useOperator } from "../../../Hooks/useOperator"
import { useUser } from "../../../Hooks/useUser"
import DateRangeDisplay from "../../Common/DateDisplay"
import HeaderPage from "../../Common/HeaderPage"
import Layout from "../../Common/Layout"
import ActivityFeed from "./ActivityFeed"
import BudgetCard from "./BudgetCard"
import DailySalesGraph from "./DailySalesGraph"
import ProvisionPicker from "./ProvisionPicker"
import TelecomTable from "./TelecomTable"
import WelcomeHeader from "./WelcomeHeader"

export const Varuhus = () => {
  const { dashboard } = useDashboard()
  const { operators } = useOperator()
  const { user } = useUser()

  const [provisionMultiplier, setProvisionMultiplier] = useState<number>(1)

  return (
    dashboard &&
    user && (
      <Layout>
        {/* Sidhuvud med titel och valbara alternativ */}
        <HeaderPage titel="Varuhus">
          <ProvisionPicker provisionMultiplier={provisionMultiplier} setProvisionMultiplier={setProvisionMultiplier} />
          <DateRangeDisplay />
        </HeaderPage>

        <div className="grid grid-cols-12 gap-6">
          {/* Välkomstbanner högst upp */}
          <WelcomeHeader user={user} provisionMultiplier={provisionMultiplier} />

          {/* Statistik per operatör */}
          {operators.map((operator) => (
            <BudgetCard key={operator.id} operator={operator} />
          ))}

          {/* Månadsprogression och aktivitetsflöde */}
          <DailySalesGraph dashboard={dashboard} />
          <ActivityFeed dashboard={dashboard} />

          {/* Telecom-tabell */}
          <TelecomTable dashboard={dashboard} />
        </div>
      </Layout>
    )
  )
}

export default Varuhus
