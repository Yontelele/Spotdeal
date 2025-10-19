import { Get } from "../Authorization/ApiHelper"
import { UserDto } from "../Models/UserDto"

export const fetchUser = async (): Promise<UserDto> => {
  return Get<UserDto>("account/me")
}
