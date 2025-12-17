<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Trackly</h1>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p class="text-gray-600 text-sm mb-6">Sign in to your account</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="you@company.com"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-600">Remember me</span>
            </label>
            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <!-- Error message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="text-sm text-gray-500">Demo credentials</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>

        <!-- Demo account info -->
        <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 space-y-1">
          <p><strong>Email:</strong> admin@trackly.com</p>
          <p><strong>Password:</strong> Password@123</p>
        </div>
      </div>

      <!-- Support links -->
      <div class="mt-6 text-center text-sm text-gray-600">
        <p>
          Don't have an account?
          <span class="text-gray-500">Contact your administrator</span>
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


