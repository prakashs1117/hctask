export const en = {
  common: {
    loading: "Loading...",
    back: "Back",
    edit: "Edit",
    add: "Add",
    created: "Created",
    lastUpdated: "Last Updated",
    completion: "Completion",
    totalEnrollment: "Total Enrollment",
    studies: "Studies",
    enrolled: "Enrolled",
    target: "Target",
    progress: "Progress",
    milestones: "Milestones",
    updated: "Updated",
  },
  program: {
    details: "Program Details",
    notFound: "Program not found",
    loadingDetails: "Loading program details...",
    backToPrograms: "Back to Programs",
    info: "Program Info",
    addStudy: "Add Study",
    noStudiesYet: "No studies added yet",
    noMilestonesSet: "No milestones set",
  },
  permissions: {
    editPrograms: "edit_programs",
    addStudies: "add_studies",
  },
} as const;

export type TranslationKey = typeof en;