import { getCurrentDate, getCurrentMonthNumberStartingFromZero, getCurrentYear } from "../../Helpers/DateHelper"
import { CalendarIcon } from "./Icons"

const formatDateSwedish = (date: Date): string => {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(date)

  const day = parts.find((p) => p.type === "day")?.value
  const month = parts.find((p) => p.type === "month")?.value
  const year = parts.find((p) => p.type === "year")?.value

  if (!day || !month || !year) return date.toLocaleDateString("sv-SE")

  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1, 3)
  return `${capitalizedMonth} ${day}, ${year}`
}

export const DateDisplay: React.FC = () => {
  const firstDayOfMonth = new Date(getCurrentYear(), getCurrentMonthNumberStartingFromZero(), 1)

  const formattedFirstDay = formatDateSwedish(firstDayOfMonth)
  const formattedCurrentDate = formatDateSwedish(getCurrentDate())

  return (
    <div className="relative">
      <div className="text-sm text-gray-300 font-medium leading-5 shadow-xs rounded-lg pl-10 py-2 px-3 bg-gray-800 w-[15rem] border border-gray-700/60">
        {formattedFirstDay} - {formattedCurrentDate}
      </div>
      <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
        <CalendarIcon className="fill-current text-gray-500 ml-3" />
      </div>
    </div>
  )
}

export default DateDisplay
