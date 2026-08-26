import type { User } from "@/lib/types";

const ALLOWED_ROLES: User["role"][] = ["admin", "staff"];

export function usePermission() {
  const isAllowed = (user: User | null) => {
    return user !== null && ALLOWED_ROLES.includes(user.role);
  };

  return { isAllowed };
}
