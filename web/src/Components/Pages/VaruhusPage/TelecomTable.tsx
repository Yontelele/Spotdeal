import { DashboardDto } from "../../../Models/DashboardDto"
import UserAvatar from "../../Common/UserAvatar"

interface Props {
  dashboard: DashboardDto
}

export const TelecomTable = ({ dashboard }: Props) => {
  const sortedSellers = [...dashboard.sellers].sort((a, b) => {
    const diffFokus = b.fokusAbonnemangSold - a.fokusAbonnemangSold
    if (diffFokus !== 0) return diffFokus

    return b.abonnemangSold - a.abonnemangSold
  })

  return (
    <div className="col-span-full xl:col-span-12 bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-700/60">
        <h2 className="font-semibold text-gray-100">{dashboard.sellers[0].store.name}</h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-700/50">
              <tr>
                <th className="p-2 whitespace-nowrap w-1/5">
                  <div className="font-semibold text-left ml-2">Namn</div>
                </th>
                <th className="p-2 whitespace-nowrap w-1/6">
                  <div className="font-semibold text-center">Abonnemang</div>
                </th>
                <th className="p-2 whitespace-nowrap w-1/6">
                  <div className="font-semibold text-center text-gray-200">Fokus</div>
                </th>
                <th className="p-2 whitespace-nowrap w-1/6">
                  <div className="font-semibold text-center">Bredband</div>
                </th>
                <th className="p-2 whitespace-nowrap w-1/6">
                  <div className="font-semibold text-center">Tv & streaming</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700/60">
              {sortedSellers.map((user) => {
                const abonnemangSold = user.abonnemangSold
                const fokusAbonnemangSold = user.fokusAbonnemangSold
                const bredbandSold = user.bredbandSold
                const tvStreamingSold = user.tvStreamingSold
                return (
                  <tr key={user.id}>
                    <td className="p-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserAvatar user={user} />
                        <div className="font-medium text-gray-100 ml-3">{user.firstName + " " + user.lastName}</div>
                        {user.id === sortedSellers[0]?.id && <span className="text-yellow-500 ml-1.5">★</span>}
                        {user.id === sortedSellers[1]?.id && <span className="text-gray-300 ml-1.5">★</span>}
                        {user.id === sortedSellers[2]?.id && <span className="text-yellow-800 ml-1.5">★</span>}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center font-medium">{abonnemangSold}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center font-medium text-gray-100">{fokusAbonnemangSold}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center font-medium">{bredbandSold}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center font-medium">{tvStreamingSold}</div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TelecomTable
