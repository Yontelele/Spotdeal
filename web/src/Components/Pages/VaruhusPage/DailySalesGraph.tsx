import { getCurrentMonthName } from "../../../Helpers/DateHelper"
import { DashboardDto } from "../../../Models/DashboardDto"
import { getGradient } from "../../Charts/GraphConfig"
import LineChart from "../../Charts/LineChart"

interface Props {
  dashboard: DashboardDto
}

export const DailySalesGraph = ({ dashboard }: Props) => {
  const labels = dashboard.dailySales.map((sale) => sale.day)
  const data = dashboard.dailySales.map((sale) => sale.abonnemangsSold)

  const dataChart = {
    labels,
    datasets: [
      {
        data,
        borderColor: "#8470FF",
        backgroundColor: function (context: any) {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) {
            return
          }
          return getGradient(ctx, chartArea, [
            { stop: 0, color: "rgba(132, 112, 255, 0)" },
            { stop: 1, color: "rgba(132, 112, 255, 0.2)" },
          ])
        },
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: "#8470FF",
        pointHoverBackgroundColor: "#8470FF",
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 10,
        tension: 0.2,
        fill: true,
      },
    ],
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-7 bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-700/60 flex justify-between">
        <h2 className="font-semibold text-gray-100">{getCurrentMonthName()} månad</h2>
        <h2 className="font-semibold text-gray-100">Budget: {dashboard.budget} fok</h2>
      </header>
      <LineChart data={dataChart} dashboard={dashboard} />
    </div>
  )
}

export default DailySalesGraph
