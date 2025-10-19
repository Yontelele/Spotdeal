import { OperatorDto } from "./OperatorDto"

export interface BredbandDto {
  id: number
  name: string
  registrationName: string
  code: string
  bindningstid: number
  provision: number
  operatorId: number
  operator: OperatorDto
}
