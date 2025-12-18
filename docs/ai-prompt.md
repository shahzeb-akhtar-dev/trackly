---

### ✅ Global project pattern

This document defines the **standard AI prompt + documentation pattern** for the whole Trackly Nuxt app.
Every new page / feature should follow this structure so that code is:

- **Consistent** across the project  
- **Typed** via shared interfaces in `app/types`  
- **Composable** in `app/composables`  
- **Visually consistent** via Tailwind + Nuxt UI + **CSS m    ** in `app/assets/css/variables.css`

---

### ✅ Folder conventions

- **`app/pages`**:  
  Route-driven pages (e.g. `auth/login.vue`, `dashboard.vue`).

- **`app/layouts`**:  
  Shared layouts (`default.vue`, `blank.vue`, etc.).

- **`app/components`**:  
  Reusable UI components (cards, tables, modals, etc.).

- **`app/composables`**:  
  Reusable logic and data fetching (e.g. `useAuthLogin`, `useProjects`, `useTableFilters`).

- **`app/types`**:  
  All shared TypeScript interfaces and types (`auth.ts`, `project.ts`, `table.ts`, etc.).

- **`app/utils`**:  
  Small, pure helper functions (formatting, validators, mappers).

- **`app/assets/css/main.css`**:  
  Entry for Tailwind / Nuxt UI styles.  
  Must **import** the design‑token file:
  `@import './,.css';`

- **`app/assets/css/main.css`**:  
  Global **CSS variables** (design tokens) used throughout the app.

---

### ✅ CSS variables pattern (design tokens)

- **File**: `app/assets/css/main.css`
- **Purpose**: central place for colors, typography, radii, shadows, spacings.
- **Usage**:
  - Use variables in Tailwind via `rgb(var(--color-primary))` patterns where needed.
  - Use in plain CSS / PostCSS like: `color: rgb(var(--color-primary));`

Recommended structure:

- **Color tokens**
  - `--color-primary`, `--color-primary-soft`, `--color-primary-strong`
  - `--color-surface`, `--color-surface-alt`
  - `--color-border-subtle`, `--color-border-strong`
  - `--color-text-main`, `--color-text-muted`, `--color-text-on-primary`

- **Radius + shadow tokens**
  - `--radius-lg`, `--radius-full`
  - `--shadow-soft`, `--shadow-strong`

- **Layout tokens**
  - `--content-max-width`, `--sidebar-width`

---

### ✅ Strict Tailwind CSS Rule

**All styling MUST use Tailwind CSS utilities. No custom CSS except for:**

1. **CSS Variables** (design tokens in `app/assets/css/main.css`)
   - Define design tokens ONLY in CSS variables
   - Use variables via `rgb(var(--color-primary))` pattern in Tailwind

2. **Scoped PostCSS** (`<style scoped lang="postcss">`)
   - **ONLY for** animations (keyframes), complex responsive logic, or unavoidable edge cases
   - Must still use CSS variables, never hardcode colors
   - Use `@apply` directive to compose Tailwind classes when readability demands it
   - Prefer Tailwind utilities in template over scoped styles

3. **FORBIDDEN:**
   - ❌ Hardcoded colors (`#0052cc`, `rgb(0, 82, 204)`)
   - ❌ Hardcoded sizing units in CSS files (use Tailwind spacing scale)
   - ❌ Inline `style=""` attributes (use Tailwind classes)
   - ❌ Plain CSS without variables
   - ❌ CSS-in-JS solutions other than scoped style blocks

4. **Tailwind Usage:**
   - ✅ Utility-first approach: `class="flex items-center gap-3 px-4 py-2 rounded-lg"`
   - ✅ Responsive prefixes: `md:w-1/2 lg:px-8 sm:block`
   - ✅ State variants: `hover:bg-primary focus:ring-2 active:scale-95`
   - ✅ Dark mode: `dark:bg-slate-900 dark:text-white`
   - ✅ Tailwind plugins (Nuxt UI components integrated)

5. **CSS Variables with Tailwind:**
   ```css
   /* In main.css */
   :root {
     --color-primary: 0 82 204;  /* RGB values without rgb() */
   }
   
   /* In template or scoped styles */
   class="bg-[rgb(var(--color-primary))]"     /* Using arbitrary value */
   color: rgb(var(--color-primary));          /* In scoped CSS */
   ```

**Example**: ✅ GOOD
```vue
<div class="flex flex-col gap-4 px-6 py-4 bg-surface rounded-lg border border-border-subtle">
  <h2 class="text-lg font-semibold text-text-main">Title</h2>
  <button class="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity">
    Click me
  </button>
</div>
```

**Example**: ❌ BAD
```vue
<div style="display: flex; gap: 1rem; background-color: #ffffff;">
  <h2 style="color: #112433; font-weight: 600;">Title</h2>
</div>

<style scoped>
.custom-div {
  background: linear-gradient(to right, #0052cc, #228bfc);
  padding: 16px 24px;
}
</style>
```

---

### ✅ Per‑page / feature markdown pattern

For every major page or feature, create a section using this pattern:

`====== Page / Feature: <Name> ======`

1. **Context / Goal**
   - Short description of the UX goal and business context.
   - Example: “Sign in users to Trackly with email/password or Google in a split layout.”

2. **Related files**
   - `app/pages/...`
   - `app/components/...`
   - `app/composables/...`
   - `app/types/...`
   - `app/utils/...` (if any)

3. **Types (in `app/types`)**
   - Define interfaces first (e.g. `AuthForm`, `Project`, `SidebarItem`).
   - Mention the exact type name and file path.

4. **Composable(s) (in `app/composables`)**
   - Name of composable (e.g. `useAuthLogin`).
   - What state, computed values, and methods it exposes.
   - How errors and loading states are handled.

5. **Template (in `pages` / `components`)**
   - High-level description of the layout:
     - Columns / sections
     - Key UI elements (forms, buttons, tables, charts, etc.)
   - Note where Tailwind utility classes and Nuxt UI components are used.
   - Mention when CSS variables are used for consistent colors / spacing.

6. **Script (`<script setup lang="ts">`)**
   - Imports:
     - Types from `~/types/...`
     - Composables from `~/composables/...`
     - Utility functions from `~/utils/...`
   - Local state (e.g. `form`, `loading`, `error`).
   - Lifecycle hooks and event handlers.

7. **Styles (`<style scoped lang="postcss">`)**
   - Page‑specific tweaks only.
   - Use Tailwind’s `@apply` where it keeps things readable.
   - Prefer **CSS variables** from `variables.css` over hard‑coded colors.

8. **AI Prompt Notes**
   - Paste the exact prompt used to generate / modify this page.
   - Include date and quick changelog bullets.

---

### ✅ Example sections to create

Use the above pattern to add sections in this file for:

- `====== Page / Feature: Auth / Login ======`
- `====== Page / Feature: Auth / Signup ======`
- `====== Page / Feature: Dashboard Overview ======`
- `====== Page / Feature: Projects / List & Board View ======`
- `====== Page / Feature: Tasks / Details Drawer ======`
- `====== Page / Feature: Global Navigation & Sidebar ======`
- `====== Page / Feature: Settings / Profile & Team ======`

Each section should follow steps **1–8** above so that future AI usage is consistent and the UI stays aligned with the global CSS variables.

---

====== Page / Feature: Auth / Login ======

1. **Context / Goal**
   - Split-screen login page with **brand gradient panel on the left** and a **carded form on the right**.
   - Supports **email / username + password** login and **Google OAuth**, styled to match the Trackly marketing design.

2. **Related files**
   - `pages/auth/login.vue` – main page.
   - `composables/auth/useAuthLogin.ts` – sign-in logic and Google handler.
   - `types/auth.ts` – `AuthForm` interface.

3. **Types (in `app/types/auth.ts`)**
   - `export interface AuthForm { email: string; password: string; rememberMe: boolean }`
   - Used in `login.vue` as the shape for `form`.

4. **Composable (in `app/composables/auth/useAuthLogin.ts`)**
   - Exposes: `{ loading, error, handleSignIn, handleGoogleSignIn }`.
   - `handleSignIn(form: AuthForm)` performs the email/password login.
   - `handleGoogleSignIn()` triggers Google OAuth.
   - `loading` and `error` are consumed by the page to render button states and error box.

5. **Template (in `pages/auth/login.vue`)**
   - **Left column** (`md:w-3/5`):
     - Background: `bg-gradient-to-br from-primary-strong to-primary`.
     - Floating circular shape using `bg-primary-soft` and `.decorative-shape`.
     - White circular icon with checkmark and brand title “Trackly”.
     - Heading “Welcome Back” + short description.
   - **Right column** (`md:w-2/5`):
     - Centered card: `bg-surface rounded-3xl shadow-soft border border-border-subtle px-8 py-10`.
     - Mobile logo row (icon in `bg-primary` and Trackly title in `text-text-main`).
     - Heading “Sign in to Trackly” with subtitle in `text-text-muted`.
     - `UInput` for email/username and **`UPassword`** for password.
     - Checkbox for “Remember me” and NuxtLink “Forgot Password?”.
     - Primary `UButton` “Sign In”.
     - Divider “Or continue with”.
     - Soft `UButton` with Google icon and label “Sign in with Google”.
     - Footer text with “Sign Up” link.

6. **Script (`<script setup lang="ts">`)**
   - Imports:
     - `ref` from `vue`.
     - `AuthForm` from `@/types/auth`.
     - `useAuthLogin` from `@/composables/auth/useAuthLogin`.
   - Page meta:
     - `definePageMeta({ layout: 'blank' })` to hide global header/footer.
   - State:
     - `form = ref<AuthForm>({ email: '', password: '', rememberMe: false })`.
     - Destructure composable: `{ loading, error, handleSignIn, handleGoogleSignIn }`.
   - `onSubmit`:
     - Basic guard that checks `email` and `password`.
     - Calls `await handleSignIn(form.value)`.

7. **Styles (`<style scoped lang="postcss">`)**
   - Keyframes `float` and `.decorative-shape` to animate the circular shape on the left column.
   - Uses Tailwind `@apply` for transitions on `.u-button:hover`.
   - (Optional future improvement) swap remaining hard-coded blue utilities in scoped CSS for `ring-primary` / variable-backed utilities.

8. **AI Prompt Notes**
   - Prompt used: “update `login.vue` and make it exact like given design and use variable for color, create design as it is in image except password use Nuxt/ui password field”.
   - Notes:
     - Colors in the template rely on Tailwind classes (`bg-primary`, `bg-primary-soft`, `text-text-main`, etc.) which map to CSS variables in `variables.css`.
     - Password field uses Nuxt UI `UPassword` component instead of a custom toggle.
