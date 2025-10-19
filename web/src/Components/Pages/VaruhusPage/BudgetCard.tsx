import { Operatorer } from "../../../Enums/Operatorer"
import { capitalizeFirstLetter } from "../../../Helpers/StringHelper"
import { useBudget } from "../../../Hooks/useBudget"
import { OperatorDto } from "../../../Models/OperatorDto"
import { DoughnutChart } from "../../Charts/DoughnutChart"

interface Props {
  operator: OperatorDto
}

export const BudgetCard = ({ operator }: Props) => {
  const { budget } = useBudget()
  const selectedBudget = budget.find((b) => b.operatorId === operator.id)
  if (!selectedBudget) return

  const abonnemangLeftToSell = Math.max(0, selectedBudget.operatorBudget - selectedBudget.abonnemangSold)

  const getChartColors = (trend: number) => {
    if (trend >= 100) return { background: "#3EC972", hover: "#34BD68" }
    if (trend >= 90) return { background: "#F0BB33", hover: "#DFAD2B" }
    return { background: "#FA4949", hover: "#C52727" }
  }

  const { background, hover } = getChartColors(selectedBudget.trending)

  const dataChart = {
    labels: ["Abonnemang sålda", "Abonnemang kvar"],
    datasets: [
      {
        data: [selectedBudget.abonnemangSold, abonnemangLeftToSell],
        backgroundColor: [background, "#6B7280"],
        hoverBackgroundColor: [hover, "#4B5563"],
        borderWidth: 0,
      },
    ],
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-gray-800 shadow-xs rounded-xl pb-12">
      <header className="px-5 pt-3 pb-2 border-b border-gray-700/60 flex justify-between">
        <div className="flex items-start">
          <h2 className="text-xl font-semibold text-gray-100">{capitalizeFirstLetter(operator.name)}</h2>
          <div className={`h-7 shrink-0 ${operator.id === Operatorer.TELE2 ? "w-9 ml-2.5 -mt-1" : "w-8 ml-1 -mt-0.5"}`}>
            <img src={operator.logoUrl} />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-100">
          {selectedBudget.abonnemangSold} / {selectedBudget.operatorBudget}
        </h2>
      </header>
      <div className="h-32 w-full">
        <DoughnutChart data={dataChart} progress={selectedBudget.progress} />
      </div>
    </div>
  )
}

export default BudgetCard
