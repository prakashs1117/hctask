export const PERMISSIONS = {
  EDIT_PROGRAMS: 'edit_programs',
  ADD_STUDIES: 'add_studies',
  VIEW_PROGRAMS: 'view_programs',
  DELETE_PROGRAMS: 'delete_programs',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];