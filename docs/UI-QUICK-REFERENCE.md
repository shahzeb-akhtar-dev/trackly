# Trackly UI Components - Quick Reference

## Component Hierarchy
```
┌─────────────────────────────────────────────────┐
│           app.vue (Root App)                    │
├─────────────────────────────────────────────────┤
│  Default Layout (default.vue)   OR  Blank Layout (blank.vue)
├──────────────────────────────────┬───────────────────────┤
│      Header Component            │   Auth Pages Only     │
│  ├─ Search Bar                   │                       │
│  ├─ Timer Widget                 │   (No header/sidebar) │
│  ├─ Notifications                │                       │
│  └─ Profile Menu                 │                       │
├──────────────────────────────────┤                       │
│      Sidebar Component           │                       │
│  ├─ Logo                         │                       │
│  ├─ User Info                    │                       │
│  ├─ MenuSection                  │                       │
│  │  └─ NavItem × N               │                       │
│  └─ Help & Support               │                       │
├──────────────────────────────────┤                       │
│      Page Content                │                       │
│  (NuxtPage component)            │                       │
└──────────────────────────────────┴───────────────────────┘
```

## Files Reference

### Layouts
| File | Purpose | Layout Type | Pages Using |
|------|---------|-------------|-------------|
| `app/layouts/default.vue` | Main app shell with header & sidebar | Authenticated | All except /auth/* |
| `app/layouts/blank.vue` | Minimal layout for auth pages | Auth | /auth/login, /auth/forgot-password, etc. |

### Components
| File | Props | Slots | Key Features |
|------|-------|-------|--------------|
| `app/components/layout/Header.vue` | - | - | Search, Timer, Notifications, Profile Menu |
| `app/components/layout/Sidebar.vue` | - | - | Navigation, User Info, Badges, Mobile Toggle |
| `app/components/layout/NavItem.vue` | `to`, `icon`, `label`, `badge?` | - | Active route detection, SVG icons |
| `app/components/layout/MenuSection.vue` | `title?` | default | Section grouping for nav items |

### Composables
| File | Exports | Key Methods | Return Type |
|------|---------|-------------|-------------|
| `app/composables/auth/useAuthState.ts` | useAuthState | setUser(), clearUser(), hasRole() | { currentUser, isAuthenticated, ... } |

### Pages
| Path | Layout | Status | Features |
|------|--------|--------|----------|
| `/` | default | ✅ Done | Dashboard with metrics, tasks, actions |
| `/auth/login` | blank | ✅ Done | Form, demo creds, mock auth |
| `/auth/forgot-password` | blank | ⏳ TODO | Email input, reset flow |
| `/auth/reset-password` | blank | ⏳ TODO | New password form |
| `/auth/verify-email` | blank | ⏳ TODO | Email verification |

## Using Components

### Example: Adding a page with Header & Sidebar
```vue
<template>
  <div>
    <h1>My Page</h1>
    <p>This automatically gets Header & Sidebar from default layout</p>
  </div>
</template>

<script setup lang="ts">
// default layout is used by default for pages NOT in /auth
// No need to specify definePageMeta
</script>
```

### Example: Adding navigation items to Sidebar
Edit `app/components/layout/Sidebar.vue` template:
```vue
<MenuSection title="My New Section">
  <NavItem
    to="/my-route"
    icon="chart-bar"
    label="My Feature"
    :badge="count"
  />
</MenuSection>
```

Available icons:
- chart-bar, check-circle, clock, calendar, hourglass
- users, chart-line, document, chat, cog, credit-card, briefcase

### Example: Accessing auth state in a component
```vue
<script setup lang="ts">
import { useAuthState } from '~/composables/auth/useAuthState'

const { displayName, isAdmin, roleLabel, hasRole } = useAuthState()

// Use in template
const canApprove = hasRole('manager') || hasRole('admin')
</script>
```

### Example: Using auth state for conditional rendering
```vue
<template>
  <div v-if="isAdmin" class="admin-panel">
    Admin controls only
  </div>
  
  <div v-else-if="isManager" class="manager-dashboard">
    Manager dashboard
  </div>
  
  <div v-else class="employee-dashboard">
    Employee dashboard
  </div>
</template>

<script setup lang="ts">
import { useAuthState } from '~/composables/auth/useAuthState'

const { isAdmin, isManager } = useAuthState()
</script>
```

## Styling Guide

### Color Classes (TailwindCSS)
```
Primary: blue-600, blue-50, blue-100, blue-700
Gray: gray-900 (text), gray-600 (muted), gray-50 (bg)
Success: green-600, green-100
Warning: orange-600, orange-100
Danger: red-600, red-100
```

### Common Patterns
```vue
<!-- Card with shadow -->
<div class="bg-white rounded-lg shadow p-6">...</div>

<!-- Section heading -->
<h2 class="text-lg font-bold text-gray-900">Title</h2>

<!-- Metric card with colored left border -->
<div class="border-l-4 border-blue-600">...</div>

<!-- Badge -->
<span class="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">3</span>

<!-- Hover effect -->
<div class="hover:bg-gray-100 cursor-pointer transition">...</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">...</div>
```

## Mobile Responsiveness Breakpoints
- `sm:` - 640px and up (landscape phones)
- `md:` - 768px and up (tablets, hide sidebar toggle)
- `lg:` - 1024px and up (desktops)

Example: Hide on mobile, show on tablet+
```vue
<div class="hidden md:block">...</div>
```

## Icon System
All icons are inline SVG with hardcoded paths. Icon names and their viewBox="0 0 20 20" SVG paths are defined in `NavItem.vue`:

```typescript
const iconPaths = {
  'chart-bar': '...',  // 3-column bar chart
  'check-circle': '...', // Checkmark in circle
  'clock': '...',      // Clock face
  // ... more icons
}
```

To add new icon: Add entry to iconPaths object in NavItem.vue with SVG d attribute value.

## Authentication Flow
```
Login Page (/auth/login)
    ↓
Submit form with email/password
    ↓
useAuthState.setUser() called
    ↓
Router redirects to /
    ↓
Dashboard loads with useAuthState data
    ↓
Header & Sidebar render with user info
    ↓
Menu items filter by isAdmin, isManager
```

## Common Tasks

### Add a new menu item
1. Edit `app/components/layout/Sidebar.vue`
2. Add `<NavItem>` inside appropriate `<MenuSection>`
3. Icon must exist in NavItem.vue iconPaths

### Change theme colors
1. Edit TailwindCSS classes in component templates
2. Or update tailwind.config.ts for global theme

### Add page with custom layout
1. Create file in `app/pages/`
2. Add `definePageMeta({ layout: 'your-layout' })`

### Add computed user role
1. Edit `app/composables/auth/useAuthState.ts`
2. Add new computed property using currentUser.value.role

### Style a component differently on mobile
1. Use `hidden md:block` to hide on mobile
2. Use `sm:`, `md:`, `lg:` prefixes for responsive styles

---
**Quick Links**:
- Layouts: `app/layouts/`
- Components: `app/components/layout/`
- Composables: `app/composables/auth/`
- Pages: `app/pages/`
- Docs: `docs/UI-IMPLEMENTATION.md`
