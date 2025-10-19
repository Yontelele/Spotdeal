import { NavLink } from "react-router-dom"
import { DashboardDto } from "../../../Models/DashboardDto"
import { ActivityDto } from "../../../Models/ActivityDto"
import { getUserInitialsByName } from "../../../Helpers/UserHelper"
import { capitalizeFirstLetter, toLowerCase } from "../../../Helpers/StringHelper"
import { getContractTypeString } from "../../../Helpers/OrderHelper"
import { Fragment } from "react"
import { EventType } from "../../../Enums/EventType"

interface Props {
  dashboard: DashboardDto
}

type HeaderItem = {
  type: "header"
  title: string
}

type ActivityItem = {
  type: "activity"
  data: ActivityDto
}

type ActivityListItem = HeaderItem | ActivityItem

type ActivityGroup = {
  title: string
  activities: ActivityDto[]
}

export const ActivityFeed = ({ dashboard }: Props) => {
  const { activityFeed } = dashboard

  const activityGroups: ActivityGroup[] = [
    { title: "Idag", activities: activityFeed.today },
    { title: "Igår", activities: activityFeed.yesterday },
    { title: "I förrgår", activities: activityFeed.twoDaysAgo },
    { title: "3+ dagar sedan", activities: activityFeed.older },
  ]

  const createActivityList = (): ActivityListItem[] => {
    const activityList: ActivityListItem[] = []

    activityGroups.forEach((group) => {
      if (group.activities.length > 0) {
        activityList.push({ type: "header", title: group.title })
        group.activities.forEach((activity) => {
          activityList.push({ type: "activity", data: activity })
        })
      }
    })

    return activityList
  }

  const ActivityItemText = ({ activity }: { activity: ActivityDto }) => {
    const { firstName, contractCount, isFokus, operatorName, contractType, eventType } = activity

    const abonnemangType = isFokus ? "fokus" : ""
    const contractTypeString = toLowerCase(getContractTypeString(contractType))
    const operator = capitalizeFirstLetter(operatorName)
    const isCancelled = eventType === EventType.Cancelled
    const action = isCancelled ? "makulerade" : "sålde"

    return (
      <Fragment>
        <span className="font-medium text-gray-100">{firstName}</span> {action}
        <span className="font-medium text-gray-100">
          {" "}
          {contractCount} st {abonnemangType}
        </span>{" "}
        {contractTypeString} hos
        <span className="font-medium text-gray-100"> {operator}</span>.
      </Fragment>
    )
  }

  const HeaderItem = ({ title }: { title: string }) => (
    <header className="text-xs uppercase text-gray-500 bg-gray-700/50 rounded-xs font-semibold p-2 my-1 first:mt-0">{title}</header>
  )

  const ActivityItem = ({ activity, showBorder }: { activity: ActivityDto; showBorder: boolean }) => (
    <div className="flex px-2">
      <div className="my-2 mr-3">
        <div className="flex items-center justify-center bg-gray-700 rounded-full font-semibold uppercase text-gray-500 w-8.5 h-8.5 text-xs">
          {getUserInitialsByName(activity.firstName, activity.lastName)}
        </div>
      </div>
      <div className={`grow flex items-center text-sm py-2 ${showBorder ? "border-b border-gray-700/60" : ""}`}>
        <div className="grow flex justify-between">
          <div className="self-center">
            <ActivityItemText activity={activity} />
          </div>
          <div className="shrink-0 self-end ml-2">
            <NavLink end to={`/order/${activity.orderId}`} className="font-medium text-violet-500 hover:text-violet-400">
              Visa<span className="hidden sm:inline"> {"->"}</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )

  const activityList = createActivityList().slice(0, 7)

  return (
    <div className="col-span-full xl:col-span-5 bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-700/60">
        <h2 className="font-semibold text-gray-100">Senaste händelserna</h2>
      </header>

      <div className="p-3">
        {activityList.map((item, index, arr) => {
          if (item.type === "header") {
            return <HeaderItem key={`header-${index}`} title={item.title} />
          }

          if (item.type === "activity") {
            const nextItem = arr[index + 1]
            const showBorder = nextItem?.type !== "header" && index !== arr.length - 1

            return <ActivityItem key={`activity-${item.data.orderId}-${item.data.eventTime}-${index}`} activity={item.data} showBorder={showBorder} />
          }

          return null
        })}
      </div>
    </div>
  )
}

export default ActivityFeed
