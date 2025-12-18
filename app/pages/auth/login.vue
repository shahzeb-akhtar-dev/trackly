<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[rgb(var(--color-primary-soft))] to-[rgb(var(--ui-color-info-50))]">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-[rgb(var(--color-primary))] rounded-[var(--radius-md)] flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-[rgb(var(--color-text-main))]">Trackly</h1>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-[rgb(var(--color-surface))] rounded-[var(--radius-lg)] shadow-sm border border-[rgb(var(--color-border-subtle))] p-8">
        <h2 class="text-2xl font-bold text-[rgb(var(--color-text-main))] mb-2">Welcome Back</h2>
        <p class="text-[rgb(var(--color-text-muted))] text-sm mb-6">Sign in to your account</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-[rgb(var(--color-text-main))] mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="you@company.com"
              required
              class="w-full px-4 py-2 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border-subtle))] rounded-[var(--radius-md)] text-[rgb(var(--color-text-main))] placeholder-[rgb(var(--color-text-muted))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent outline-none transition-all"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold text-[rgb(var(--color-text-main))] mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-2 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border-subtle))] rounded-[var(--radius-md)] text-[rgb(var(--color-text-main))] placeholder-[rgb(var(--color-text-muted))] focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent outline-none transition-all"
            />
          </div>

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="w-4 h-4 accent-[rgb(var(--color-primary))] border-[rgb(var(--color-border-subtle))] rounded focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              />
              <span class="text-sm text-[rgb(var(--color-text-muted))]">Remember me</span>
            </label>
            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm text-[rgb(var(--color-primary))] hover:opacity-80 font-semibold transition-opacity"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <!-- Error message -->
          <div v-if="error" class="p-3 bg-[rgba(var(--ui-color-error-500),0.12)] border border-[rgba(var(--ui-color-error-500),0.3)] rounded-[var(--radius-md)]">
            <p class="text-sm text-[rgb(var(--ui-color-error-500))]">{{ error }}</p>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2 px-4 bg-[rgb(var(--color-primary))] text-white font-semibold rounded-[var(--radius-md)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 border-t border-[rgb(var(--color-border-subtle))]"></div>
          <span class="text-sm text-[rgb(var(--color-text-muted))]">Demo credentials</span>
          <div class="flex-1 border-t border-[rgb(var(--color-border-subtle))]"></div>
        </div>

        <!-- Demo account info -->
        <div class="p-3 bg-[rgb(var(--color-surface-alt))] border border-[rgba(var(--color-primary),0.2)] rounded-[var(--radius-md)] text-sm text-[rgb(var(--color-text-main))] space-y-1">
          <p><strong>Email:</strong> admin@trackly.com</p>
          <p><strong>Password:</strong> Password@123</p>
        </div>
      </div>

      <!-- Support links -->
      <div class="mt-6 text-center text-sm text-[rgb(var(--color-text-muted))]">
        <p>
          Don't have an account?
          <span class="text-[rgb(var(--color-text-muted))]">Contact your administrator</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthState } from '~/composables/auth/useAuthState'

definePageMeta({
  layout: 'blank',
})

const router = useRouter()
const { setUser } = useAuthState()

const form = ref({
  email: '',
  password: '',
  rememberMe: false,
})

const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    // TODO: Call actual login API
    // const { data } = await $fetch('/api/auth/login', {
    //   method: 'POST',
    //   body: form.value
    // })

    // Mock user for demonstration
    const mockUser = {
      id: '1',
      email: form.value.email,
      name: 'John Doe',
      role: form.value.email === 'admin@trackly.com' ? ('admin' as const) : ('employee' as const),
      company_id: 'comp-1',
      tenant_id: 'tenant-1',
    }

    setUser(mockUser)
    await router.push('/')
  } catch (err) {
    error.value = 'Invalid email or password. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>


