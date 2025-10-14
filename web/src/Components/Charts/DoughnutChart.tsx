import { Fragment } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart, DoughnutController, ArcElement, Tooltip, TimeScale } from "chart.js"

Chart.register(DoughnutController, ArcElement, Tooltip, TimeScale)

Chart.defaults.font.family = '"Inter", sans-serif'
Chart.defaults.font.weight = 500

Chart.defaults.plugins.tooltip.borderWidth = 1
Chart.defaults.plugins.tooltip.displayColors = false
Chart.defaults.plugins.tooltip.mode = "nearest"
Chart.defaults.plugins.tooltip.intersect = false
Chart.defaults.plugins.tooltip.position = "nearest"
Chart.defaults.plugins.tooltip.caretSize = 0
Chart.defaults.plugins.tooltip.caretPadding = 20
Chart.defaults.plugins.tooltip.cornerRadius = 8
Chart.defaults.plugins.tooltip.padding = 8
Chart.defaults.plugins.tooltip.backgroundColor = "#374151"
Chart.defaults.plugins.tooltip.bodyColor = "#9CA3AF"
Chart.defaults.plugins.tooltip.borderColor = "#4B5563"
Chart.defaults.plugins.tooltip.titleColor = "#F3F4F6"

export const DoughnutChart = ({ data, progress }: any) => {
  const options = {
    maintainAspectRatio: false,
    cutout: "79%",
    layout: {
      padding: 16,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 500,
    },
  }

  return (
    <Fragment>
      <div className="px-5 pt-1.5">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-100 tabular-nums">
            <span>{progress <= 100 ? progress : "100"}</span>%
          </div>
        </div>
      </div>
      <Doughnut options={options} data={data} />
    </Fragment>
  )
}
