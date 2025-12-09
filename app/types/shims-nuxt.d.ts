// types/shims-nuxt.d.ts
// Minimal ambient types to help the TypeScript server recognize Nuxt macros

declare function definePageMeta<T extends Record<string, any>>(meta: T): void

declare function definePageHead<T extends Record<string, any>>(meta: T): void

declare const navigateTo: (to: string) => void

// Minimal global shim for Nuxt's config helper used in `nuxt.config.ts`
declare function defineNuxtConfig<T extends Record<string, any>>(config: T): T
