# Pharma RCD - Drug Development Portfolio Dashboard

> **Production-Ready Next.js Application for Pharmaceutical Portfolio Management**

A comprehensive, enterprise-grade dashboard for managing drug development programs, clinical studies, and research teams. Built with modern technologies and best practices for scalability, maintainability, and user experience.

## 🌟 Features

### Core Functionality
- ✅ **Dashboard Module** - Portfolio overview with real-time statistics
- ✅ **Programs Module** - Create and manage drug development programs
- ✅ **IAM Module** - Identity & access management for teams
- ✅ **Alerts Module** - Deadline notifications and timeline management
- ✅ **Role-Based Access Control** - Manager, Staff, and Viewer permissions
- ✅ **Advanced Filtering** - Search by phase, therapeutic area, and status

### Technical Excellence
- 🎨 **Dark/Light Theme** - Seamless theme switching with next-themes
- 🌍 **Internationalization** - Support for multiple languages (EN/ES)
- 📱 **Fully Responsive** - Mobile-first design with Tailwind CSS
- 🎯 **Feature Flags** - Centralized feature toggle management
- 🚀 **Performance Optimized** - React Query caching and optimized rendering
- 📊 **State Management** - Zustand for lightweight, scalable state
- 🔒 **Type-Safe** - Comprehensive TypeScript coverage
- 📝 **JSDoc Documentation** - Inline documentation for all components

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Custom shadcn/ui components
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes
- **Icons**: Lucide React

## 📁 Project Structure

```
pharma-dashboard/
├── app/                    # Next.js pages (App Router)
├── components/             # React components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── features/          # Feature-specific components
│   └── providers/         # Context providers
├── lib/                   # Utilities and business logic
│   ├── api/              # Data access layer
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand stores
│   └── utils/            # Helper functions
├── data/                  # Mock data & locales
│   ├── mock/             # JSON mock data
│   └── locales/          # i18n translations
└── types/                 # TypeScript definitions
```

## 🎯 Key Features

### Role-Based Access Control

The application implements a comprehensive permission system:

**Manager Role:**
- ✅ Create, edit, and delete programs
- ✅ Add and edit studies
- ✅ Manage users and roles
- ✅ Set alerts and notifications
- ✅ Full read access

**Staff Role:**
- ✅ View programs and studies
- ✅ Add and edit studies
- ✅ View alerts
- ❌ Cannot create/delete programs
- ❌ Cannot manage users

**Viewer Role:**
- ✅ View programs and studies
- ✅ View alerts
- ❌ No editing capabilities

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

## 📊 Data Architecture

### Mock Data Structure

All data is stored as JSON files in `data/mock/`:

- `programs.json` - Drug development programs
- `studies.json` - Clinical studies
- `users.json` - Team members and roles
- `alerts.json` - Deadline notifications
- `milestones.json` - Program milestones

**Ready for API Integration**: Replace mock functions in `lib/api/data.ts` with actual API calls.

### State Management

**Server State** (TanStack Query):
- Programs, studies, users, alerts
- Automatic caching and background refetching
- Optimistic updates

**Client State** (Zustand):
- Authentication (user, role, permissions)
- UI state (sidebar, modals, loading)
- Filters (search, phase, area)

## 🎨 Theming

Built-in dark/light mode with system preference detection:

```typescript
const { theme, setTheme } = useTheme();

// Toggle theme
setTheme('dark'); // or 'light' or 'system'
```

Theme preference persists across sessions.

## 🧪 Development

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📚 Component Examples

### Using Program Badges

```tsx
import { PhaseBadge, TherapeuticAreaBadge } from '@/components/features/ProgramBadge';

<PhaseBadge phase="Phase II" />
<TherapeuticAreaBadge area="Oncology" />
```

### Using Enrollment Progress Bar

```tsx
import { EnrollmentBar } from '@/components/features/EnrollmentBar';

<EnrollmentBar current={84} target={120} showLabel />
```

### Permission Checks

```tsx
const { hasPermission } = useAuthStore();

{hasPermission('create_programs') && (
  <Button>Create Program</Button>
)}
```

## 🔌 API Integration Guide

Replace mock data with real API calls:

```typescript
// lib/api/data.ts
export async function getPrograms(): Promise<Program[]> {
  const response = await fetch('/api/programs');
  return response.json();
}
```

React Query automatically handles:
- Loading states
- Error handling
- Caching
- Background refetching

## 📈 Performance Optimizations

- ✅ Route-based code splitting
- ✅ React Query caching
- ✅ Memoized components and hooks
- ✅ Optimized images and fonts
- ✅ Tailwind CSS purging
- ✅ Tree-shaking and minification

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Connect your GitHub repository to Vercel
# Deploy automatically on push to main
```

### Docker

```bash
docker build -t pharma-rcd .
docker run -p 3000:3000 pharma-rcd
```

## 🔒 Security

- ✅ Role-based access control
- ✅ TypeScript type safety
- ✅ XSS protection (React)
- ✅ Input validation (Zod)
- ✅ No hardcoded secrets

## 📝 Code Quality

- **TypeScript**: Strict mode enabled, zero `any` types
- **JSDoc**: All functions documented
- **ESLint**: Configured with Next.js best practices
- **Component Architecture**: Single responsibility principle
- **Clean Code**: Meaningful names, small functions, clear logic

## 🎯 Interview Requirements Met

✅ **shadcn/ui sidebar** - Fully implemented with navigation
✅ **Component-based** - Modular, reusable components
✅ **Feature flags** - Centralized configuration
✅ **Customizable** - Themes, locales, role-based views
✅ **JSON data** - Organized in `data/mock/` folder
✅ **Localization** - EN/ES support with easy expansion
✅ **Dark/Light theme** - System preference support
✅ **Responsive** - Mobile-first design
✅ **Clean code** - JSDoc, TypeScript, organized structure
✅ **Easy to understand** - Clear folder structure, documented

## 🎓 Learning Resources

This project demonstrates:

- Next.js 16 App Router patterns
- TypeScript best practices
- Component composition
- State management strategies
- Accessibility implementation
- Responsive design techniques
- Modern React patterns

## 📄 License

MIT License - Free to use for learning and commercial projects.

---

**Built for interview demonstration** • Shows production-ready architecture and modern development practices
