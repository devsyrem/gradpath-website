/**
 * GradPath — RBAC (Role-Based Access Control) Policy Engine
 *
 * Defines permissions per role and provides enforcement helpers.
 */

const config = require('../backend/config');
const { STUDENT, ACADEMIC_STAFF, PLACEMENT_SUPERVISOR, ADMIN } = config.roles;

/**
 * Permission matrix.
 * Each role maps to an array of allowed actions.
 */
const permissions = {
  [STUDENT]: [
    'placement:read:own',
    'placement:apply',
    'report:read:own',
    'report:create:own',
    'profile:read:own',
    'profile:update:own',
  ],

  [ACADEMIC_STAFF]: [
    'placement:read:all',
    'placement:create',
    'placement:update',
    'placement:approve',
    'report:read:all',
    'report:review',
    'student:read:all',
    'profile:read:own',
    'profile:update:own',
  ],

  [PLACEMENT_SUPERVISOR]: [
    'placement:read:assigned',
    'placement:update:assigned',
    'placement:feedback',
    'report:read:assigned',
    'report:review:assigned',
    'student:read:assigned',
    'profile:read:own',
    'profile:update:own',
  ],

  [ADMIN]: [
    'placement:read:all',
    'placement:create',
    'placement:update',
    'placement:delete',
    'placement:approve',
    'report:read:all',
    'report:create',
    'report:delete',
    'student:read:all',
    'student:create',
    'student:update',
    'student:delete',
    'user:read:all',
    'user:create',
    'user:update',
    'user:delete',
    'audit:read',
    'profile:read:own',
    'profile:update:own',
    'settings:manage',
  ],
};

/**
 * Check whether a role has a specific permission.
 * @param {string} role
 * @param {string} permission
 * @returns {boolean}
 */
function hasPermission(role, permission) {
  const rolePerms = permissions[role];
  if (!rolePerms) return false;
  return rolePerms.includes(permission);
}

/**
 * Check whether a role has ALL of the given permissions.
 */
function hasAllPermissions(role, requiredPermissions) {
  return requiredPermissions.every((perm) => hasPermission(role, perm));
}

/**
 * Check whether a role has ANY of the given permissions.
 */
function hasAnyPermission(role, requiredPermissions) {
  return requiredPermissions.some((perm) => hasPermission(role, perm));
}

/**
 * Get all permissions for a role.
 */
function getPermissions(role) {
  return permissions[role] || [];
}

module.exports = {
  permissions,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getPermissions,
};
