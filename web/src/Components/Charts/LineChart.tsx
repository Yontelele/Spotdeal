import { Fragment } from "react"
import { Line } from "react-chartjs-2"
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler, Tooltip, Legend } from "chart.js"
import { DashboardDto } from "../../Models/DashboardDto"

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend)

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

interface Props {
  data: any
  dashboard: DashboardDto
}

export const LineChart = ({ data, dashboard }: Props) => {
  const options = {
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: () => "Abonnemang sålda",
          label: (context: any) => context.parsed.y + " fok",
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(55, 65, 81, 0.6)",
        },
        ticks: {
          maxTicksLimit: 10,
          callback: (value: any) => value,
          color: "#6B7280",
        },
        border: {
          display: false,
        },
        beginAtZero: true,
      },
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "nearest" as const,
    },
  }

  return (
    <Fragment>
      <div className="px-5 py-3">
        <div className="flex justify-between">
          <div className="flex flex-col text-gray-400">
            <div className="text-sm">Abonnemang sålda</div>
            <div className="text-3xl font-bold text-gray-100 tabular-nums">
              {dashboard.abonnemangSold} fok {dashboard.abonnemangSold > dashboard.budget ? "✅" : ""}
            </div>
          </div>
          <div className="flex flex-col text-gray-400">
            <div className="text-sm">Trend mot budget</div>
            <div className="flex items-start">
              <div className="text-3xl font-bold text-gray-100 mr-2 tabular-nums">{dashboard.trendingProcent}%</div>
              {dashboard.trendingProcent >= 100 ? (
                <div className="text-sm font-medium px-1.5 rounded-full text-green-700 mt-1" style={{ backgroundColor: "rgba(62, 201, 114, 0.2)" }}>
                  +{dashboard.trendingProcent - 100}%
                </div>
              ) : dashboard.trendingProcent >= 90 ? (
                <div className="text-sm font-medium px-1.5 rounded-full text-yellow-700 mt-1" style={{ backgroundColor: "rgba(240, 187, 51, 0.2)" }}>
                  -{100 - dashboard.trendingProcent}%
                </div>
              ) : (
                <div className="text-sm font-medium px-1.5 rounded-full text-red-700 mt-1" style={{ backgroundColor: "rgba(255, 86, 86, 0.2)" }}>
                  -{100 - dashboard.trendingProcent}%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Line options={options} data={data} height={100} />
    </Fragment>
  )
}

export default LineChart
