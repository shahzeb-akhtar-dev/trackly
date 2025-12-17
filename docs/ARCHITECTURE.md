# Trackly UI Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Client                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Nuxt 3 Application Shell                   │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │     Header Component                        │   │   │
│  │  │  ├─ Search Bar                              │   │   │
│  │  │  ├─ Timer Widget                            │   │   │
│  │  │  ├─ Notifications Bell                      │   │   │
│  │  │  └─ Profile Dropdown                        │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │     Main Content Area                        │  │   │
│  │  │  (NuxtPage - Routed Components)              │  │   │
│  │  │                                              │  │   │
│  │  │  ┌────────────────────────────────────────┐ │  │   │
│  │  │  │   Page-Specific Components             │ │  │   │
│  │  │  │   (Dashboard, Tasks, Settings, etc.)   │ │  │   │
│  │  │  └────────────────────────────────────────┘ │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │     Sidebar Component                       │   │   │
│  │  │  ├─ Logo Section                            │   │   │
│  │  │  ├─ User Section                            │   │   │
│  │  │  ├─ MenuSection × 3                         │   │   │
│  │  │  │  ├─ NavItem (Dashboard)                  │   │   │
│  │  │  │  ├─ NavItem (Tasks) with badge          │   │   │
│  │  │  │  ├─ NavItem (Time Tracking)             │   │   │
│  │  │  │  ├─ NavItem (Management) [conditional]  │   │   │
│  │  │  │  ├─ NavItem (Approvals) with badge      │   │   │
│  │  │  │  ├─ NavItem (Reports)                   │   │   │
│  │  │  │  ├─ NavItem (Chat) with badge           │   │   │
│  │  │  │  ├─ NavItem (Admin) [conditional]       │   │   │
│  │  │  │  └─ NavItem (Settings)                  │   │   │
│  │  │  └─ Help & Support                         │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      State Management Layer                         │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │  useAuthState (Composable)                          │   │
│  │  ├─ currentUser ref                               │   │
│  │  ├─ isAuthenticated ref                           │   │
│  │  ├─ Computed: isOwner, isAdmin, isManager        │   │
│  │  ├─ Computed: displayName, roleLabel             │   │
│  │  └─ Methods: setUser, clearUser, hasRole         │   │
│  │                                                      │   │
│  │  useAuthLogin (Composable - existing)              │   │
│  │  ├─ handleSignIn                                  │   │
│  │  ├─ handleGoogleSignIn                            │   │
│  │  └─ Other auth methods                            │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Router Configuration                          │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │  Routes:                                            │   │
│  │  ├─ /                  → index.vue (default layout)│   │
│  │  ├─ /auth/login        → login.vue (blank layout) │   │
│  │  ├─ /auth/forgot-password (TODO)                  │   │
│  │  ├─ /auth/reset-password (TODO)                   │   │
│  │  ├─ /task-management   (TODO)                     │   │
│  │  ├─ /time-management   (TODO)                     │   │
│  │  ├─ /approvals         (TODO)                     │   │
│  │  ├─ /reports           (TODO)                     │   │
│  │  ├─ /chat              (TODO)                     │   │
│  │  ├─ /settings          (TODO)                     │   │
│  │  └─ /payroll           (TODO)                     │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓↑
                    (HTTP Requests)
┌─────────────────────────────────────────────────────────────┐
│              Backend API Layer (Future)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ├─ POST /api/auth/login                                    │
│  ├─ POST /api/auth/logout                                   │
│  ├─ POST /api/auth/forgot-password                          │
│  ├─ POST /api/auth/reset-password                           │
│  ├─ GET  /api/dashboard/metrics                             │
│  ├─ GET  /api/timers/active                                 │
│  ├─ POST /api/timers/stop                                   │
│  ├─ GET  /api/approvals/pending                             │
│  ├─ GET  /api/chat/unread                                   │
│  └─ [14 Module APIs - See module docs]                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Authentication Flow
```
User → Login Page
   ↓
[Form Submission]
   ↓
setUser() in useAuthState
   ↓
currentUser.value = { id, email, name, role, ... }
isAuthenticated.value = true
   ↓
Router.push('/') → Dashboard
   ↓
Dashboard uses displayName from useAuthState
   ↓
Sidebar uses isAdmin/isManager for menu filtering
   ↓
Header shows user profile dropdown
```

### 2. Navigation Rendering Flow
```
User clicks NavItem
   ↓
NuxtLink navigates to route
   ↓
useRoute() detects new route in NavItem
   ↓
isActive computed property updates
   ↓
NavItem highlights with blue background
   ↓
Router loads new page with appropriate layout
```

### 3. Menu Visibility Flow
```
Page Load
   ↓
useAuthState() reads currentUser.value
   ↓
Computed properties:
  - isAdmin = currentUser.role === 'admin'
  - isManager = currentUser.role in ['admin', 'manager']
   ↓
Sidebar renders with v-if checks:
  <div v-if="isAdmin">Admin Items</div>
  <div v-if="isManager">Manager Items</div>
   ↓
Only visible items render to user
```

### 4. Component Tree Example
```
App.vue (Root)
├── default.vue (Layout)
    ├── Header.vue
    │   ├── Search Input
    │   ├── Timer Widget (static)
    │   ├── Notifications
    │   └── Profile Dropdown
    ├── Sidebar.vue
    │   ├── Logo Section
    │   ├── User Section (uses useAuthState)
    │   └── MenuSection × 3
    │       └── NavItem × N (uses useRoute for active state)
    └── NuxtPage (Routed Component)
        └── index.vue (Dashboard)
            ├── Metric Card
            ├── Metric Card
            ├── Metric Card
            ├── Metric Card
            ├── Recent Tasks
            └── Quick Actions

App.vue (Root)
├── blank.vue (Layout)
    └── NuxtPage (Routed Component)
        └── auth/login.vue
            ├── Logo
            ├── Form
            │   ├── Email Input
            │   ├── Password Input
            │   └── Submit Button
            └── Demo Credentials
```

---

## State Management Architecture

### Current (Composable-based)
```
useAuthState (Global Composable)
├── Shared State: currentUser, isAuthenticated
├── Mutations: setUser(), clearUser()
├── Queries: hasRole()
└── Computed Properties: isOwner, isAdmin, isManager, displayName, roleLabel

Used by:
├── Sidebar.vue (isAdmin, isManager, displayName, roleLabel)
├── Header.vue (User profile info)
├── Dashboard.vue (displayName)
└── auth/login.vue (setUser on success)
```

### Future (With Pinia - Optional)
```
Auth Store (Pinia)
├── State: { user, isAuthenticated, token }
├── Getters: { isAdmin(), hasRole() }
├── Actions: { login(), logout(), refreshToken() }
└── Persisted in localStorage

UI Store (Pinia - Optional)
├── State: { sidebarOpen, themeMode, notifications }
├── Getters: { isMobile() }
└── Actions: { toggleSidebar(), setTheme() }
```

---

## Component Integration Map

### Header ↔ Other Components
```
Header.vue
├── Imports: useRouter (for logout redirect)
├── Provides: Global timer display
├── Receives: User profile from useAuthState
└── Emits: [Profile click → Dropdown shown]
```

### Sidebar ↔ Other Components
```
Sidebar.vue
├── Imports: useAuthState (role filtering)
├── Contains: MenuSection → NavItem
├── Provides: Navigation structure
├── Receives: Role info for conditional rendering
└── Integrates: Mobile toggle overlay
```

### NavItem ↔ Router
```
NavItem.vue
├── Uses: useRoute() to detect active state
├── Integrates: NuxtLink for routing
├── Props: to (route path), icon, label, badge
└── Emits: Navigation to new route
```

---

## Styling Architecture

### TailwindCSS Utility Classes Used
```
Layout:
  flex, grid, gap, px, py, w, h, min-h, max-w

Colors:
  bg-white, bg-gray-50/100/900, bg-blue-600, bg-red-500
  text-gray-900, text-gray-600, text-white
  border-gray-200, border-blue-600

Typography:
  text-xs/sm/base/lg/xl/2xl/3xl
  font-semibold/bold/medium

Spacing:
  mb, mt, ml, mr, p (padding)
  gap (grid gap)

Effects:
  shadow, shadow-sm, shadow-lg
  rounded, rounded-lg
  hover:, focus:, transition

Responsive:
  sm:, md:, lg:
  hidden md:block (show on tablet+)
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

Interactive:
  cursor-pointer, hover:bg-gray-100
  focus:ring-2, focus:ring-blue-500
  disabled:opacity-50
```

### Color System
```
Primary (Actions):       blue-600, blue-700 (hover)
Secondary (Text):       gray-900, gray-600, gray-400
Tertiary (Background):  gray-50, white
Success:                green-600, green-100
Warning:                orange-600, orange-100
Error:                  red-600, red-100
```

---

## Responsive Design Breakpoints

### Mobile First Approach
```
Base (Mobile)    - Default styles
├─ sm: 640px     - Landscape phones
├─ md: 768px     - Tablets (where sidebar appears)
├─ lg: 1024px    - Desktops
└─ xl: 1280px    - Large desktops

Example:
<div class="hidden md:block">
  Shows on tablet and up
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  1 column (mobile)
  2 columns (sm)
  4 columns (lg)
</div>
```

---

## Performance Considerations

### Current Optimizations
- ✅ Inline SVG icons (no image requests)
- ✅ Computed properties (reactive caching)
- ✅ Lazy-loaded routes (Nuxt auto code-splitting)
- ✅ No external font downloads
- ✅ Minimal CSS (TailwindCSS PurgeCSS)

### Future Optimizations
- ⏳ Image lazy loading
- ⏳ API response caching
- ⏳ Service worker for offline support
- ⏳ Component-level code splitting
- ⏳ Bundle size optimization

---

## Security Considerations

### Currently Implemented
- ✅ No hardcoded secrets in components
- ✅ Client-side role-based UI filtering
- ✅ Form structure for validation

### To Implement
- ⏳ Server-side auth validation
- ⏳ JWT token secure storage
- ⏳ CSRF tokens
- ⏳ Input sanitization
- ⏳ Rate limiting
- ⏳ HTTPS enforcement

---

## Testing Architecture

### Unit Tests (Recommended)
```
Components/
├─ Header.vue.spec.ts
├─ Sidebar.vue.spec.ts
├─ NavItem.vue.spec.ts
└─ MenuSection.vue.spec.ts

Composables/
└─ useAuthState.spec.ts

Pages/
├─ index.spec.ts
└─ auth/login.spec.ts
```

### Integration Tests
```
Flows/
├─ login-flow.spec.ts (Login → Dashboard)
├─ navigation-flow.spec.ts (Menu items working)
└─ role-filtering.spec.ts (Admin vs Employee)
```

### E2E Tests
```
Scenarios/
├─ user-can-login.e2e.ts
├─ user-can-navigate.e2e.ts
└─ responsive-design.e2e.ts
```

---

## Development Workflow

### 1. Creating a New Page
```
1. Create file in app/pages/
2. Import useAuthState if needed
3. Use default layout (or define custom with definePageMeta)
4. Add route to navbar docs

Example:
app/pages/my-feature.vue
├─ Uses default layout automatically
├─ Header and Sidebar appear
└─ Route appears in navigation menu
```

### 2. Adding New Navigation Item
```
1. Edit app/components/layout/Sidebar.vue
2. Add NavItem inside MenuSection
3. Icon must exist in NavItem.vue iconPaths

Example:
<NavItem
  to="/my-feature"
  icon="chart-bar"
  label="My Feature"
  :badge="count"
/>
```

### 3. Accessing User Role
```
import { useAuthState } from '~/composables/auth/useAuthState'

const { isAdmin, isManager, displayName } = useAuthState()

// Use in template:
<div v-if="isAdmin">Admin only</div>
```

---

## Documentation Map

```
Root Docs/
├─ UI-IMPLEMENTATION.md      (Comprehensive guide)
├─ UI-QUICK-REFERENCE.md    (Quick lookup)
├─ COMPLETION-REPORT.md     (Project status)
└─ modules/                 (Business logic docs)
   ├─ 00-authentication.md
   ├─ 01-tenant.md
   └─ ... (14 total)

Component-Specific:
├─ app/components/layout/Header.vue        (inline comments)
├─ app/components/layout/Sidebar.vue       (inline comments)
├─ app/composables/auth/useAuthState.ts   (JSDoc)
└─ app/pages/index.vue                     (inline comments)
```

---

**Architecture Version**: 1.0.0
**Last Updated**: December 2024
**Framework Stack**: Nuxt 3 + Vue 3 + TailwindCSS
