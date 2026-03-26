export const ROLES = {
  CUSTOMER: "customer",
  STAFF: "staff",
  BRANCH_MANAGER: "branch_manager",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

export function isAdminLike(role) {
  return [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
}

export function isStaffLike(role) {
  return [
    ROLES.STAFF,
    ROLES.BRANCH_MANAGER,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
  ].includes(role);
}
