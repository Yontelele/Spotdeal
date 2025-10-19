import { UserRole } from "../Enums/UserRole"
import { UserDto } from "../Models/UserDto"

export const getUserRole = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return "Admin"
    case UserRole.Manager:
      return "Chef"
    default:
      return "Säljare"
  }
}

export const getUserInitials = (user: UserDto): string => {
  if (!user.firstName || !user.lastName) {
    return "??"
  }
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
}

export const getUserInitialsByName = (firstName: string, lastName: string): string => {
  if (!firstName || !lastName) {
    return "??"
  }
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export const getUserFullName = (user: UserDto): string => `${user.firstName} ${user.lastName}`
