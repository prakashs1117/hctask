# Pharma RCD - Drug Development Portfolio Dashboard

> **Production-Ready Next.js Application for Pharmaceutical Portfolio Management**

**Live Demo:** [https://hctask.vercel.app](https://hctask.vercel.app)

A comprehensive, enterprise-grade dashboard for managing drug development programs, clinical studies, and research teams. Built with modern technologies and best practices for scalability, maintainability, and user experience.

## Features

### Core Functionality
- **Dashboard Module** - Portfolio overview with real-time statistics and charts
- **Programs Module** - Create, edit, and manage drug development programs
- **Program Detail** - Detailed view with milestones, studies, and metrics
- **IAM Module** - Identity & access management with user table, filters, and edit/view dialogs
- **Alerts Module** - Deadline notifications with filtering and alert creation
- **Role-Based Access Control** - Manager, Staff, and Viewer permissions
- **Advanced Filtering** - Search, phase, therapeutic area, and status filters with debounced input

### Technical Excellence
- **Dark/Light Theme** - Seamless theme switching with next-themes
- **Internationalization** - Support for multiple languages (EN/ES)
- **Fully Responsive** - Mobile-first design with Tailwind CSS
- **Feature Flags** - Centralized feature toggle management
- **Performance Optimized** - React Query caching, memoized components and custom hooks
- **State Management** - Zustand for client state, TanStack Query for server state
- **Type-Safe** - Comprehensive TypeScript coverage
- **API Routes** - Next.js API routes for programs, users, and alerts
- **Testing** - Jest + React Testing Library test suite
- **Charts** - Data visualization with Recharts

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Technology Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16.1 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19 |
| **Styling** | Tailwind CSS 3 |
| **UI Primitives** | Radix UI (Dialog, Select, Checkbox, Dropdown Menu, Label, Separator) |
| **State (Client)** | Zustand 5 |
| **State (Server)** | TanStack Query 5 |
| **Tables** | TanStack React Table 8 |
| **Forms** | React Hook Form 7 + Zod 4 |
| **Charts** | Recharts 3 |
| **Theme** | next-themes |
| **Toasts** | Sonner |
| **Icons** | Lucide React |
| **Testing** | Jest 30 + React Testing Library |
| **Linting** | ESLint 9 + eslint-config-next |

## Project Structure

```
pharma-dashboard/
├── __tests__/                  # Test files
│   ├── app/
│   │   ├── api/programs/       # API route tests
│   │   └── programs/           # Page component tests
│   ├── components/
│   │   ├── features/           # Feature component tests
│   │   └── forms/              # Form component tests
│   └── lib/data/               # Data layer tests
├── app/                        # Next.js App Router pages
│   ├── api/                    # API routes
│   │   ├── alerts/             # Alerts API
│   │   ├── programs/[id]/      # Program detail API
│   │   ├── programs/           # Programs API
│   │   └── users/[id]/         # User detail API
│   │   └── users/              # Users API
│   ├── alerts/                 # Alerts page
│   ├── iam/                    # IAM page
│   ├── programs/[id]/          # Program detail page
│   ├── programs/               # Programs listing page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Dashboard (home) page
│   └── globals.css             # Global styles
├── components/                 # React components (Atomic Design)
│   ├── atoms/                  # Base UI primitives
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   ├── molecules/              # Composed UI components
│   │   ├── clear-filters-button.tsx
│   │   ├── empty-state.tsx
│   │   ├── enrollment-bar.tsx
│   │   ├── filter-badge.tsx
│   │   ├── filter-toggle-button.tsx
│   │   ├── metric-card.tsx
│   │   ├── not-found-state.tsx
│   │   ├── program-badge.tsx
│   │   ├── program-grid-card.tsx
│   │   ├── program-list-item.tsx
│   │   ├── results-count.tsx
│   │   ├── search-input.tsx
│   │   ├── stat-card.tsx
│   │   ├── translated-text.tsx
│   │   └── view-mode-toggle.tsx
│   ├── organisms/              # Complex feature components
│   │   ├── alerts/             # Alert filters, create dialog/form
│   │   ├── dashboard/          # Dashboard header, stats
│   │   ├── iam/                # User table, filters, edit/view dialogs
│   │   ├── program-detail/     # Program info, milestones, studies
│   │   ├── programs/           # Program CRUD, filters, portfolio
│   │   ├── filter-sidebar.tsx
│   │   ├── header.tsx
│   │   ├── page-header.tsx
│   │   └── sidebar.tsx
│   └── providers/              # Context providers
│       ├── i18n-provider.tsx
│       ├── query-provider.tsx
│       └── theme-provider.tsx
├── data/                       # Mock data & locales
│   ├── locales/                # i18n translation files (EN/ES)
│   └── mock/                   # JSON mock data
│       ├── alerts.json
│       ├── milestones.json
│       ├── programs.json
│       ├── studies.json
│       └── users.json
├── docs/                       # Documentation
│   └── PRISMA_POSTGRES_INTEGRATION_PLAN.md
├── lib/                        # Utilities and business logic
│   ├── api/                    # Data access layer
│   │   └── data.ts
│   ├── constants/              # App constants
│   │   ├── permissions.ts
│   │   └── ui.ts
│   ├── data/                   # Server-side data operations
│   │   ├── programs.ts
│   │   └── users.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── useDebounce.ts
│   │   ├── useErrorBoundary.ts
│   │   ├── useFilteredPrograms.ts
│   │   ├── useOptimizedFilters.ts
│   │   ├── useProgramCalculations.ts
│   │   ├── useProgramMetrics.ts
│   │   ├── usePrograms.ts
│   │   └── useTranslation.ts
│   ├── i18n/                   # Internationalization setup
│   │   ├── index.ts
│   │   └── translations/en.ts
│   ├── stores/                 # Zustand stores
│   │   ├── authStore.ts
│   │   ├── filterStore.ts
│   │   └── uiStore.ts
│   └── utils/                  # Helper functions
│       ├── cn.ts
│       ├── featureFlags.ts
│       └── formatters.ts
├── public/                     # Static assets
├── types/                      # TypeScript type definitions
│   └── index.ts
├── jest.config.mjs             # Jest configuration
├── jest.setup.js               # Jest setup file
├── eslint.config.mjs           # ESLint configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
└── package.json
```

## Key Features

### Role-Based Access Control

The application implements a comprehensive permission system:

**Manager Role:**
- Create, edit, and delete programs
- Add and edit studies
- Manage users and roles
- Set alerts and notifications
- Full read access

**Staff Role:**
- View programs and studies
- Add and edit studies
- View alerts
- Cannot create/delete programs
- Cannot manage users

**Viewer Role:**
- View programs and studies
- View alerts
- No editing capabilities

### Feature Flags

Centralized feature management in `lib/utils/featureFlags.ts`:

```typescript
export const featureFlags = {
  enableIAM: true,
  enablePrograms: true,
  enableDashboard: true,
  enableAlerts: true,
  enableRBAC: true,
  enableDarkMode: true,
  enableI18n: true,
};
```

### Internationalization

Supports multiple languages with easy switching:

```typescript
const { t, locale, changeLocale } = useTranslation();

// Use translations
t('common.search') // "Search" or "Buscar"

// Switch language
changeLocale('es');
```

## Data Architecture

### Mock Data Structure

All data is stored as JSON files in `data/mock/`:

- `programs.json` - Drug development programs
- `studies.json` - Clinical studies
- `users.json` - Team members and roles
- `alerts.json` - Deadline notifications
- `milestones.json` - Program milestones

### API Routes

The application includes Next.js API routes for data operations:

| Route | Methods | Description |
|---|---|---|
| `/api/programs` | GET, POST | List and create programs |
| `/api/programs/[id]` | GET, PUT, DELETE | Program CRUD by ID |
| `/api/users` | GET, POST | List and create users |
| `/api/users/[id]` | GET, PUT, DELETE | User CRUD by ID |
| `/api/alerts` | GET, POST | List and create alerts |

### State Management

**Server State** (TanStack Query):
- Programs, studies, users, alerts
- Automatic caching and background refetching
- Optimistic updates

**Client State** (Zustand):
- Authentication (user, role, permissions)
- UI state (sidebar, modals, loading)
- Filters (search, phase, area)

## Component Architecture

The project follows **Atomic Design** methodology:

- **Atoms** (`components/atoms/`) - Base UI primitives (Button, Input, Badge, Card, Dialog, etc.)
- **Molecules** (`components/molecules/`) - Composed components (SearchInput, MetricCard, EnrollmentBar, ProgramBadge, etc.)
- **Organisms** (`components/organisms/`) - Complex feature components (ProgramPortfolio, UserTable, DashboardStats, etc.)
- **Providers** (`components/providers/`) - Context providers for theme, i18n, and query client

### Custom Hooks

| Hook | Purpose |
|---|---|
| `usePrograms` | Program data fetching with TanStack Query |
| `useProgramMetrics` | Computed program metrics and statistics |
| `useProgramCalculations` | Memoized enrollment calculations |
| `useFilteredPrograms` | Filtered program list based on active filters |
| `useOptimizedFilters` | Centralized filter logic with memoized handlers |
| `useDebounce` | Debounced search input for better UX |
| `useTranslation` | i18n translation hook |
| `useErrorBoundary` | Error handling following React best practices |

## Theming

Built-in dark/light mode with system preference detection:

```typescript
const { theme, setTheme } = useTheme();

// Toggle theme
setTheme('dark'); // or 'light' or 'system'
```

Theme preference persists across sessions.

## Development

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Component Examples

### Using Program Badges

```tsx
import { PhaseBadge, TherapeuticAreaBadge } from '@/components/molecules/program-badge';

<PhaseBadge phase="Phase II" />
<TherapeuticAreaBadge area="Oncology" />
```

### Using Enrollment Progress Bar

```tsx
import { EnrollmentBar } from '@/components/molecules/enrollment-bar';

<EnrollmentBar current={84} target={120} showLabel />
```

### Permission Checks

```tsx
const { hasPermission } = useAuthStore();

{hasPermission('create_programs') && (
  <Button>Create Program</Button>
)}
```

## Performance Optimizations

- Route-based code splitting
- React Query caching with background refetching
- `useMemo` and `useCallback` for expensive calculations and event handlers
- `React.memo` on frequently rendered components (badges, filter buttons)
- Constant extraction outside components to prevent recreation on each render
- Custom hooks for reusable memoized logic
- Debounced search input
- Tailwind CSS purging
- Tree-shaking and minification

## Deployment

### Vercel (Recommended)

The application is deployed on Vercel at [https://hctask.vercel.app](https://hctask.vercel.app).

```bash
# Connect your GitHub repository to Vercel
# Deploy automatically on push to main
```

### Docker

```bash
docker build -t pharma-rcd .
docker run -p 3000:3000 pharma-rcd
```

## Security

- Role-based access control with 13 granular permissions
- TypeScript type safety
- XSS protection (React)
- Input validation (Zod schemas)
- No hardcoded secrets

## Code Quality

- **TypeScript**: Strict mode, zero `any` types
- **ESLint**: Configured with Next.js best practices
- **Testing**: Jest + React Testing Library for unit and integration tests
- **Atomic Design**: Clear component hierarchy (atoms/molecules/organisms)
- **Clean Code**: Meaningful names, small functions, single responsibility

## Future Roadmap

- **Database Integration**: Prisma + PostgreSQL migration plan available at `docs/PRISMA_POSTGRES_INTEGRATION_PLAN.md`
- **E2E Testing**: Cypress integration plan available at `CYPRESS_INTEGRATION_PLAN.md`

## License

MIT License - Free to use for learning and commercial projects.

---

**Built for interview demonstration** - Shows production-ready architecture and modern development practices
