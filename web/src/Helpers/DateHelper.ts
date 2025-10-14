import { Months } from "../Enums/Months"

export const GetDaysInMonth = (month: number, year: number): number => {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31
    case 4:
    case 6:
    case 9:
    case 11:
      return 30
    case 2:
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28
    default:
      throw new Error()
  }
}

export const getCurrentDate = (): Date => new Date()

export const getCurrentDayOfMonth = (): number => getCurrentDate().getDate()

export const getCurrentYear = (): number => getCurrentDate().getFullYear()

export const getCurrentMonthNumberStartingFromZero = (): number => getCurrentDate().getMonth()

export const getCurrentMonthNumber = (): number => getCurrentDate().getMonth() + 1

export const getCurrentMonthWithTwoDigits = (): string => (getCurrentDate().getMonth() + 1).toString().padStart(2, "0")

export const getMonthName = (monthNumber: number): string => Months[monthNumber]

export const getCurrentMonthName = (): string => {
  const currentMonthNumber = getCurrentMonthNumber()
  return getMonthName(currentMonthNumber)
}

export const getDaysInCurrentMonth = (): number => {
  const currentMonth = getCurrentMonthNumber()
  const currentYear = getCurrentYear()
  return GetDaysInMonth(currentMonth, currentYear)
}

export const getSelectedMonthWithTwoDigits = (selectedDate: Date): string => (selectedDate.getMonth() + 1).toString().padStart(2, "0")
