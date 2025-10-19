import { CompanyDto } from "./CompanyDto"

export interface StoreDto {
  id: number
  companyId: number
  name: string
  city: string
  isActive: boolean
  company: CompanyDto
}
