import { useMemo } from 'react';

// Define the structure of our translations
export interface Translations {
  [key: string]: string | Translations;
}

// Simple implementation - in a real app, you'd use next-i18next or similar
let translations: Translations = {};

// Load translations (this would be done at build time or app startup)
export const loadTranslations = async (locale: string = 'en'): Promise<Translations> => {
  try {
    const response = await fetch(`/locales/${locale}.json`);
    translations = await response.json();
    return translations;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    return {};
  }
};

// Get nested value from object using dot notation
const getNestedValue = (obj: Translations, path: string): string => {
  const keys = path.split('.');
  let current: string | Translations | undefined = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return '';
    }
  }

  return typeof current === 'string' ? current : '';
};

// Translation function with interpolation support
export const t = (key: string, params: Record<string, string | number> = {}): string => {
  let value = getNestedValue(translations, key);

  if (!value) {
    // Fallback to key if translation not found
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }

  // Simple interpolation - replace {variable} with values
  Object.keys(params).forEach(param => {
    value = value.replace(new RegExp(`{${param}}`, 'g'), String(params[param]));
  });

  return value;
};

// Hook for using translations in components
export const useTranslation = () => {
  return useMemo(() => ({
    t,
    translations
  }), []);
};

// Initialize translations when the module loads
if (typeof window !== 'undefined') {
  loadTranslations('en');
} else {
  // For server-side, load asynchronously
  (async () => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const translationsPath = path.join(process.cwd(), 'public/locales/en.json');
      if (fs.existsSync(translationsPath)) {
        translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load translations on server:', error);
    }
  })();
}

// Export commonly used translation keys as constants for better type safety
export const TRANSLATION_KEYS = {
  COMMON: {
    LOADING: 'common.loading',
    BACK: 'common.back',
    EDIT: 'common.edit',
    ADD: 'common.add',
    CREATE: 'common.create',
    CANCEL: 'common.cancel',
    SAVE: 'common.save',
    DELETE: 'common.delete',
    VIEW: 'common.view',
    SEARCH: 'common.search',
    FILTER: 'common.filter',
    FILTERS: 'common.filters',
    CLEAR_ALL: 'common.clearAll',
    CLEAR_ALL_FILTERS: 'common.clearAllFilters',
    NO_RESULTS: 'common.noResults',
    CREATED: 'common.created',
    LAST_UPDATED: 'common.lastUpdated',
    UPDATED: 'common.updated',
    COMPLETION: 'common.completion',
    TOTAL_ENROLLMENT: 'common.totalEnrollment',
    STUDIES: 'common.studies',
    ENROLLED: 'common.enrolled',
    TARGET: 'common.target',
    PROGRESS: 'common.progress',
    MILESTONES: 'common.milestones',
    STATUS: 'common.status',
    ACTIVE: 'common.active',
    INACTIVE: 'common.inactive',
    COMPLETED: 'common.completed',
    PENDING: 'common.pending',
    OVERDUE: 'common.overdue',
    NAME: 'common.name',
    DESCRIPTION: 'common.description',
    MANAGER: 'common.manager',
    EMAIL: 'common.email',
  },
  PROGRAM: {
    DETAILS: 'program.details',
    NOT_FOUND: 'program.notFound',
    LOADING_DETAILS: 'program.loadingDetails',
    BACK_TO_PROGRAMS: 'program.backToPrograms',
    INFO: 'program.info',
    ADD_STUDY: 'program.addStudy',
    NO_STUDIES_YET: 'program.noStudiesYet',
    NO_MILESTONES_SET: 'program.noMilestonesSet',
    CREATE_PROGRAM: 'program.createProgram',
    EDIT_PROGRAM: 'program.editProgram',
    PROGRAM_NAME: 'program.programName',
    PROGRAM_MANAGER: 'program.programManager',
    THERAPEUTIC_AREA: 'program.therapeuticArea',
    DEVELOPMENT_PHASE: 'program.developmentPhase',
    PROGRAM_STATUS: 'program.programStatus',
    SEARCH_PROGRAMS: 'program.searchPrograms',
    PROGRAM_PORTFOLIO: 'program.programPortfolio',
    PORTFOLIO_FILTERS: 'program.portfolioFilters',
    PROGRAM_FILTERS: 'program.programFilters',
  },
  DASHBOARD: {
    TITLE: 'dashboard.title',
    SUBTITLE: 'dashboard.subtitle',
    SUBTITLE_SHORT: 'dashboard.subtitleShort',
    LAST_UPDATED: 'dashboard.lastUpdated',
    OVERVIEW: 'dashboard.overview',
    RESULTS_COUNT: 'dashboard.resultsCount',
    RESULTS_COUNT_SHORT: 'dashboard.resultsCountShort',
    NO_PROGRAMS_FOUND: 'dashboard.noProgramsFound',
    NO_PROGRAMS_FOUND_DESC: 'dashboard.noProgramsFoundDesc',
    ENROLLMENT_PROGRESS: 'dashboard.enrollmentProgress',
    PARTICIPANTS: 'dashboard.participants',
    STATS: {
      TOTAL_PROGRAMS: 'dashboard.stats.totalPrograms',
      TOTAL_PROGRAMS_DESC: 'dashboard.stats.totalProgramsDesc',
      ACTIVE_STUDIES: 'dashboard.stats.activeStudies',
      ACTIVE_STUDIES_DESC: 'dashboard.stats.activeStudiesDesc',
      AVG_ENROLLMENT: 'dashboard.stats.avgEnrollment',
      AVG_ENROLLMENT_DESC: 'dashboard.stats.avgEnrollmentDesc',
      ACTIVE_ALERTS: 'dashboard.stats.activeAlerts',
      ACTIVE_ALERTS_DESC: 'dashboard.stats.activeAlertsDesc',
    },
  },
  ALERTS: {
    TITLE: 'alerts.title',
    SUBTITLE: 'alerts.subtitle',
    CREATE_ALERT: 'alerts.createAlert',
    ALERT_FILTERS: 'alerts.alertFilters',
    SEARCH_ALERTS: 'alerts.searchAlerts',
    ACTIVE_ALERTS: 'alerts.activeAlerts',
    OVERDUE: 'alerts.overdue',
    NEXT_SEVEN_DAYS: 'alerts.nextSevenDays',
    PROGRAM: 'alerts.program',
    STUDY: 'alerts.study',
    DEADLINE: 'alerts.deadline',
    CHANNEL: 'alerts.channel',
    ALERT_STATUS: 'alerts.alertStatus',
    NOTIFICATION_CHANNEL: 'alerts.notificationChannel',
    DAYS_LEFT: 'alerts.daysLeft',
    DAYS_OVERDUE: 'alerts.daysOverdue',
    SNOOZE: 'alerts.snooze',
    DISMISS: 'alerts.dismiss',
    NO_ALERTS_CONFIGURED: 'alerts.noAlertsConfigured',
    NO_ALERTS_CONFIGURED_DESC: 'alerts.noAlertsConfiguredDesc',
    NO_ALERTS_MATCH: 'alerts.noAlertsMatch',
    NO_ALERTS_MATCH_DESC: 'alerts.noAlertsMatchDesc',
    RESULTS_COUNT: 'alerts.resultsCount',
    RESULTS_COUNT_SHORT: 'alerts.resultsCountShort',
  },
  IAM: {
    TITLE: 'iam.title',
    SUBTITLE: 'iam.subtitle',
    ADD_USER: 'iam.addUser',
    USER_FILTERS: 'iam.userFilters',
    SEARCH_USERS: 'iam.searchUsers',
    USER_DIRECTORY: 'iam.userDirectory',
    TOTAL_USERS: 'iam.totalUsers',
    MANAGERS: 'iam.managers',
    STAFF: 'iam.staff',
    VIEWERS: 'iam.viewers',
    USER_ROLE: 'iam.userRole',
    ACCOUNT_STATUS: 'iam.accountStatus',
    PROGRAMS: 'iam.programs',
    NO_ASSIGNMENTS: 'iam.noAssignments',
    RESULTS_COUNT: 'iam.resultsCount',
    RESULTS_COUNT_SHORT: 'iam.resultsCountShort',
    NO_USERS_FOUND: 'iam.noUsersFound',
    NO_USERS_FOUND_DESC: 'iam.noUsersFoundDesc',
  },
  FILTERS: {
    ACTIVE_FILTERS: 'filters.activeFilters',
    FILTER_SETTINGS: 'filters.filterSettings',
    CURRENT_FILTERS: 'filters.currentFilters',
    QUICK_ACTIONS: 'filters.quickActions',
    QUICK_FILTERS: 'filters.quickFilters',
    SEARCH: 'filters.search',
    PHASE: 'filters.phase',
    AREA: 'filters.area',
    ROLE: 'filters.role',
    CHANNEL: 'filters.channel',
    NONE: 'filters.none',
  },
  VALIDATION: {
    REQUIRED: 'validation.required',
    EMAIL_INVALID: 'validation.emailInvalid',
    NAME_TOO_SHORT: 'validation.nameTooShort',
    NAME_TOO_LONG: 'validation.nameTooLong',
    DESCRIPTION_TOO_LONG: 'validation.descriptionTooLong',
  },
  MESSAGES: {
    CREATE_SUCCESS: 'messages.createSuccess',
    UPDATE_SUCCESS: 'messages.updateSuccess',
    DELETE_SUCCESS: 'messages.deleteSuccess',
    CREATE_ERROR: 'messages.createError',
    UPDATE_ERROR: 'messages.updateError',
    DELETE_ERROR: 'messages.deleteError',
    LOADING_ERROR: 'messages.loadingError',
    NETWORK_ERROR: 'messages.networkError',
  },
} as const;