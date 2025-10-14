import { UserDto } from "../Models/UserDto"
import { useSignalR } from "./useSignalR"

interface Props {
  user: UserDto
}

export const SignalR = ({ user }: Props) => {
  useSignalR(user)
  return null
}

export default SignalR
