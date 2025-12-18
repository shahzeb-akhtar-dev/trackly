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
