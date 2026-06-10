import type { Role } from "@prisma/client";

export function isAdmin(role?: Role) {
  return role === "ADMIN";
}

export function isStaffOrAdmin(role?: Role) {
  return role === "ADMIN" || role === "STAFF";
}

export function isCustomer(role?: Role) {
  return role === "CUSTOMER";
}