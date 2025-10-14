import { UserDto } from "../../../Models/UserDto"
import UserAvatar from "../../Common/UserAvatar"

interface Props {
  user: UserDto
  provisionMultiplier: number
}

export const WelcomeHeader = ({ user, provisionMultiplier }: Props) => (
  <div className="flex flex-col col-span-full xl:col-span-12 bg-gray-800 shadow-xs rounded-xl pt-6 pb-6 pl-5 pr-5">
    <div className="flex items-center">
      <UserAvatar user={user} size="xl" />
      <div className="flex flex-col text-gray-400 ml-4">
        <div>
          Välkommen tillbaka <strong className="text-gray-100">{user.firstName} 🚀</strong>, din beräknade provision denna månad:
        </div>
        <div className="text-3xl font-bold text-green-400 mt-1">{user.provision * provisionMultiplier} kr</div>
      </div>
    </div>
  </div>
)

export default WelcomeHeader
