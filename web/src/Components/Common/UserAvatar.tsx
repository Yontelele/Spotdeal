import { getUserInitials } from "../../Helpers/UserHelper"
import { UserDto } from "../../Models/UserDto"

interface Props {
  user: UserDto
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

export const UserAvatar = ({ user, size }: Props) => {
  const getSize = (size: "xs" | "sm" | "md" | "lg" | "xl" | undefined) => {
    switch (size) {
      case "xs":
        return "w-6 h-6 text-[10px]"
      case "sm":
        return "w-7 h-7 text-[10px]"
      case "md":
        return "w-8 h-8 text-xs"
      case "lg":
        return "w-10 h-10 text-sm"
      case "xl":
        return "w-16 h-16 text-lg"
      default:
        return "w-8 h-8 text-xs"
    }
  }

  return (
    <div className={`flex items-center justify-center bg-gray-700 rounded-full font-semibold uppercase text-gray-500 ${getSize(size)}`}>
      {getUserInitials(user)}
    </div>
  )
}

export default UserAvatar
