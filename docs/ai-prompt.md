---

### ✅ Global Project Pattern

This document defines the **standard AI prompt + documentation pattern** for the whole Trackly Nuxt app.
Every new page / feature should follow this structure so that code is:

- **Consistent** across the project  
- **Typed** via shared interfaces in `app/types`  
- **State managed** via Pinia stores in `app/stores` for shared data
- **Composable** in `app/composables` for API calls and local logic
- **Visually consistent** via **Tailwind CSS utilities** strictly

---

### ✅ Folder Conventions

- **`app/pages`**:  
  Route-driven pages (e.g. `auth/login.vue`, `dashboard.vue`).

- **`app/layouts`**:  
  Shared layouts (`default.vue`, `blank.vue`, etc.).

- **`app/components`**:  
  Reusable UI components (cards, tables, modals, etc.).

- **`app/stores`**:  
  Pinia stores for **global state shared across multiple components**.
  - Use stores for: user auth state, layout/UI state, navigation, cached data
  - Stores are auto-imported via `@pinia/nuxt`

- **`app/composables`**:  
  Reusable logic for **API calls and component-local state**.
  - Use composables for: API fetching, form handling, local UI logic
  - NOT for global shared state (use stores instead)

- **`app/types`**:  
  All shared TypeScript interfaces and types (`auth.ts`, `layout.ts`, `project.ts`, etc.).

- **`app/utils`**:  
  Small, pure helper functions (formatting, validators, mappers).

- **`app/assets/css/main.css`**:  
  Entry for Tailwind styles and CSS variables (design tokens).

---

### ✅ Store vs Composable Decision Guide

| Use Case | Use Store | Use Composable |
|----------|-----------|----------------|
| User authentication state | ✅ | ❌ |
| Layout/sidebar/header state | ✅ | ❌ |
| Navigation items & active state | ✅ | ❌ |
| Cached data shared across pages | ✅ | ❌ |
| API calls (fetch, create, update) | ❌ | ✅ |
| Form state & validation | ❌ | ✅ |
| Component-local UI state | ❌ | ✅ |
| Data transformation logic | ❌ | ✅ |

**Rule of thumb:**
- **Store**: Data that needs to persist or be accessed from multiple unrelated components
- **Composable**: Logic that fetches/mutates data or is used within a single component tree

---

### ✅ Store Structure Pattern

```
app/stores/
├── auth.ts          # User, token, permissions (persisted)
├── layout.ts        # Sidebar, header, theme state (persisted)
├── navigation.ts    # Nav items, active route
├── projects.ts      # Cached projects data
└── notifications.ts # Notification state
```

**Store Template:**

```typescript
// app/stores/example.ts
import { defineStore } from 'pinia'

interface ExampleState {
  items: Item[]
  loading: boolean
}

export const useExampleStore = defineStore('example', {
  state: (): ExampleState => ({
    items: [],
    loading: false,
  }),

  getters: {
    activeItems: (state) => state.items.filter(i => i.active),
  },

  actions: {
    setItems(items: Item[]) {
      this.items = items
    },
  },

  // Optional: persist specific fields to localStorage
  persist: {
    pick: ['items'],
  },
})
```

---

### ✅ Composable Pattern (for API calls)

```typescript
// app/composables/api/useProjects.ts
export const useProjects = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/projects')
      // Optionally update store with fetched data
      const projectStore = useProjectStore()
      projectStore.setProjects(data)
      return data
    } catch (e) {
      error.value = 'Failed to fetch projects'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, fetchProjects }
}
```

---

### ✅ Strict Tailwind CSS Rule

**All styling MUST use Tailwind CSS utilities. No exceptions.**

#### ✅ ALLOWED:

1. **Tailwind utility classes in templates:**
   ```vue
   <div class="flex items-center gap-4 px-6 py-4 bg-white rounded-lg border border-gray-200">
     <h2 class="text-lg font-semibold text-gray-900">Title</h2>
     <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
       Click me
     </button>
   </div>
   ```

2. **Responsive prefixes:**
   ```vue
   <div class="w-full md:w-1/2 lg:w-1/3 p-4 lg:p-8">
   ```

3. **State variants:**
   ```vue
   <button class="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 active:scale-95">
   ```

4. **Dark mode:**
   ```vue
   <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
   ```

5. **CSS Variables (design tokens only) in `main.css`:**
   ```css
   :root {
     --color-primary: 59 130 246;  /* RGB values */
   }
   ```

6. **Arbitrary values when needed:**
   ```vue
   <div class="w-[calc(100%-2rem)] bg-[rgb(var(--color-primary))]">
   ```

#### ❌ FORBIDDEN:

- ❌ Hardcoded colors: `style="color: #0052cc"`
- ❌ Inline styles: `style="padding: 16px"`
- ❌ `<style scoped>` blocks with custom CSS (except keyframes)
- ❌ CSS-in-JS or external CSS files per component
- ❌ `@apply` directive (use utility classes directly)

#### Exception - Keyframe Animations Only:

```vue
<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
```

---

### ✅ Icon Usage

Use `@nuxt/icon` with Iconify icons:

```vue
<Icon name="heroicons:chart-bar" class="w-5 h-5 text-gray-600" />
<Icon name="heroicons:user-solid" class="w-6 h-6" />
<Icon name="lucide:settings" class="w-4 h-4" />
```

Common icon sets:
- `heroicons:` - Heroicons (outline)
- `heroicons:*-solid` - Heroicons (solid)
- `lucide:` - Lucide icons
- `mdi:` - Material Design Icons

---

### ✅ Component Template

```vue
<template>
  <div class="flex flex-col gap-4 p-6 bg-white rounded-xl border border-gray-200">
    <!-- Content with Tailwind classes only -->
  </div>
</template>

<script setup lang="ts">
// 1. Imports
import type { MyType } from '~/types/example'
import { useMyStore } from '~/stores/example'
import { useMyApi } from '~/composables/api/useMyApi'

// 2. Store & Composables
const store = useMyStore()
const { loading, fetchData } = useMyApi()

// 3. Local state
const localState = ref('')

// 4. Computed
const computed = computed(() => store.items.length)

// 5. Methods
const handleClick = () => {
  // ...
}

// 6. Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<!-- NO <style> block unless absolutely necessary for keyframes -->
```

---

### ✅ Per-Page / Feature Documentation Pattern

For every major page or feature, create a section:

`====== Page / Feature: <Name> ======`

1. **Context / Goal** - UX goal and business context
2. **Related files** - pages, components, stores, composables, types
3. **Types** - Interface definitions
4. **Store(s)** - What global state is used/modified
5. **Composable(s)** - API calls and local logic
6. **Template** - Layout description with Tailwind classes
7. **Script** - Imports, state, methods overview
8. **AI Prompt Notes** - Prompt used and changelog

---

====== Page / Feature: Auth / Login ======

1. **Context / Goal**
   - Split-screen login page with brand gradient panel and carded form.
   - Supports email/password login and Google OAuth.

2. **Related files**
   - `app/pages/auth/login.vue`
   - `app/stores/auth.ts`
   - `app/composables/auth/useAuthLogin.ts`
   - `app/types/auth.ts`

3. **Types (`app/types/auth.ts`)**
   ```typescript
   export interface AuthForm {
     email: string
     password: string
     rememberMe: boolean
   }
   ```

4. **Store (`app/stores/auth.ts`)**
   - Manages: `user`, `token`, `isAuthenticated`, `permissions`
   - Persisted fields: `token`, `user`, `isAuthenticated`

5. **Composable (`app/composables/auth/useAuthLogin.ts`)**
   - `handleSignIn(form)` - Email/password login API call
   - `handleGoogleSignIn()` - Google OAuth
   - Updates `authStore` on success

6. **Template**
   - Left column: Brand gradient, decorative shapes, welcome text
   - Right column: Login card with form inputs, buttons
   - All styling via Tailwind utilities

---

====== Page / Feature: Global Layout (Header + Sidebar) ======

1. **Context / Goal**
   - Persistent header with search, timer, notifications, profile
   - Collapsible sidebar with navigation sections

2. **Related files**
   - `app/layouts/default.vue`
   - `app/components/layout/Header.vue`
   - `app/components/layout/Sidebar.vue`
   - `app/components/layout/NavItem.vue`
   - `app/components/layout/MenuSection.vue`
   - `app/stores/layout.ts`
   - `app/stores/navigation.ts`

3. **Stores**
   - `useLayoutStore`: sidebar state, header menus, theme, responsive breakpoints
   - `useNavigationStore`: nav items, active item

4. **Template**
   - Header: Fixed top, breadcrumb, timer widget, search, notifications, profile dropdown
   - Sidebar: Fixed left, logo, nav sections, user footer
   - All Tailwind utilities, Icon component for icons

---

====== Page / Feature: Time Tracking - Global Timer ======

1. **Context / Goal**
   - Real-time timer visible in header on every page
   - Track active task work across entire application
   - Start/pause/resume/stop timer with automatic time log creation
   - One active timer per user at any time

2. **Related files**
   - `app/components/time-tracking/TimerWidget.vue` - Timer UI component (block + inline variants)
   - `app/components/layout/Header.vue` - Inline timer widget in header
   - `app/composables/time-tracking/useTimer.ts` - Timer state & API logic
   - `app/types/timer.ts` - Timer & TimeLog interfaces
   - Backend: `/api/timers/*` - Timer management endpoints

3. **Types (`app/types/timer.ts`)**
   ```typescript
   export interface Timer {
     id: number
     user_id: number
     company_id: number
     task_id: number
     project_id: number
     task: Task
     project: Project
     started_at: string     // ISO timestamp
     paused_at: string | null
     paused_duration_seconds: number
     is_running: boolean
     is_paused: boolean
     notes: string | null
     created_at: string
     updated_at: string
   }

   export interface TimeLog {
     id: number
     task_id: number
     user_id: number
     date_logged: string
     start_time: string
     end_time: string
     duration_seconds: number
     duration_hours: number
     description: string | null
     status: 'logged' | 'pending_approval' | 'approved' | 'rejected'
     created_at: string
     updated_at: string
   }
   ```

4. **Composable (`app/composables/time-tracking/useTimer.ts`)**
   - State: `activeTimer`, `loading`, `error`, `elapsedSeconds`
   - Computed: `isRunning`, `isPaused`
   - Actions:
     - `getActiveTimer()` - Fetch active timer (GET /api/timers/active)
     - `startTimer(taskId, notes?)` - Start new timer (POST /api/timers/start)
     - `pauseTimer()` - Pause running timer (PATCH /api/timers/active/pause)
     - `resumeTimer()` - Resume paused timer (PATCH /api/timers/active/resume)
     - `stopTimer(description?)` - Stop & create time log (POST /api/timers/active/stop)
     - `discardTimer()` - Cancel timer (DELETE /api/timers/active)
     - `clearError()` - Clear error state

5. **Component (`app/components/time-tracking/TimerWidget.vue`)**
   - **Props:**
     - `variant: 'block' | 'inline'` - Display variant
     - `taskName: string` - Current task name
   - **Block Variant (Dashboard):**
     - Large timer display with HH:MM:SS boxes
     - "Current Session" header with ACTIVE badge
     - Break (pause/resume) and Stop buttons
     - Error message display
   - **Inline Variant (Header):**
     - Compact display: task name + timer + action buttons
     - Hidden on mobile (`hidden md:flex`)
     - Smaller icons and text
   - **Features:**
     - Real-time timer update (computed from elapsed seconds)
     - Toggle Break → Resume button based on pause state
     - Sync with server every 30 seconds
     - Error auto-clear after 5 seconds
     - Disabled state during API calls

6. **Template Usage**
   ```vue
   <!-- Block variant (Dashboard) -->
   <TimerWidget variant="block" taskName="Redesign Homepage" />

   <!-- Inline variant (Header) -->
   <TimerWidget variant="inline" taskName="Redesign Homepage" />
   ```

7. **Script Setup Pattern**
   ```typescript
   // 1. Import composable
   import { useTimer } from '~/composables/time-tracking/useTimer'

   // 2. Use composable
   const timerComposable = useTimer()

   // 3. Computed for display
   const hours = computed(() => {
     const h = Math.floor(timerComposable.elapsedSeconds / 3600)
     return String(h).padStart(2, '0')
   })

   // 4. Methods handle actions
   const handleBreak = async () => {
     if (timerComposable.isPaused) {
       await timerComposable.resumeTimer()
     } else {
       await timerComposable.pauseTimer()
     }
   }

   // 5. Lifecycle syncs state
   onMounted(async () => {
     await timerComposable.getActiveTimer()
     intervalId = setInterval(syncTimer, 30000)
   })
   ```

8. **API Integration**
   - All endpoints use `$fetch` with Authorization header
   - Error handling: catches `e.data.message`, logs to console
   - Loading state during API calls
   - Response types typed from `Timer` and `TimeLog` interfaces

9. **Best Practices Followed**
   - ✅ Composable for API & state logic (not in component)
   - ✅ Typed interfaces from `app/types/timer.ts`
   - ✅ Strict Tailwind CSS (no inline styles)
   - ✅ Responsive design (hidden md:flex for header)
   - ✅ Error state management with auto-clear
   - ✅ Disabled buttons during loading
   - ✅ Server sync every 30 seconds
   - ✅ Proper lifecycle cleanup (clearInterval)
   - ✅ Icon component for Tabler icons
   - ✅ JSDoc comments on composable functions

10. **State Flow**
    ```
    User clicks "Break" button
      ↓
    TimerWidget.handleBreak()
      ↓
    useTimer.pauseTimer() API call
      ↓
    activeTimer.is_paused = true
      ↓
    Button icon changes: pause → play
    Button text changes: Break → Resume
      ↓
    User can click again to resume
    ```

11. **Edge Cases Handled**
    - No active timer: Error state shown
    - API error: Error message displayed for 5 seconds
    - Loading state: Buttons disabled, opacity reduced
    - Pause state: Button toggles to Resume
    - Component unmounts: Interval cleared, memory safe
    - Timer sync: Every 30 seconds validates server state

