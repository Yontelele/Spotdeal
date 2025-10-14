import { Get } from "../Authorization/ApiHelper"
import { PhoneDto } from "../Models/PhoneDto"

export const fetchPhones = async (): Promise<PhoneDto[]> => {
  return Get<PhoneDto[]>("phone")
}
