// types/shims.d.ts
// Ambient module re-exports to help the TypeScript server resolve path-alias imports

declare module "~/types/auth" {
  export * from "./auth"
}
