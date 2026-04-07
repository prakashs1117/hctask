export const PERMISSIONS = {
  CREATE_PROGRAMS: 'create_programs',
  EDIT_PROGRAMS: 'edit_programs',
  ADD_STUDIES: 'add_studies',
  VIEW_PROGRAMS: 'view_programs',
  DELETE_PROGRAMS: 'delete_programs',
  MANAGE_USERS: 'manage_users',
  SET_ALERTS: 'set_alerts',
  VIEW_ALERTS: 'view_alerts',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];