<template>
  <div class="flex min-h-screen bg-white">
    <!-- Left Column: Branding & Welcome Message -->
    <div
      class="hidden md:flex w-2/5 bg-gradient-to-br from-primary-strong to-primary relative overflow-hidden left-bg"
    >


      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center items-start p-12 lg:p-16 text-white">
        <!-- Logo & Checkmark -->
        <div class="flex items-center gap-3 mb-12">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-soft">
            <Icon name="mdi:check" class="w-7 h-7 text-white" />
          </div>
          <h1 class="text-4xl font-bold text-white">Trackly</h1>
        </div>

        <!-- Welcome Heading -->
        <h2 class="text-5xl font-bold mb-6 leading-tight">
          Welcome Back
        </h2>

        <!-- Description -->
        <p class="text-lg text-blue-100 max-w-md leading-relaxed">
          Your gateway to seamless productivity and project management. Log in to continue your journey.
        </p>
      </div>
    </div>

    <!-- Right Column: Login Form -->
    <div class="w-full md:w-3/5 flex items-center justify-center bg-white p-6 md:p-12">
      <div
        class="w-full max-w-sm bg-surface rounded-3xl shadow-soft border border-border-subtle px-8 py-10"
      >
        <!-- Mobile Logo (visible on small screens) -->
        <div class="md:hidden flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Icon name="mdi:check" class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-text-main">Trackly</h1>
        </div>

        <!-- Form Heading -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-text-main mb-2">Sign in to Trackly</h2>
          <p class="text-text-muted">Enter your details below to access your account.</p>
        </div>

        <!-- Sign In Form -->
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Email / Username Input -->
          <div>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Email / Username"
              icon="i-heroicons-envelope-20-solid"
              size="lg"
              :ui="{ base: 'rounded-lg' }"
            />
          </div>

          <!-- Password Input using Nuxt UI password field -->
          <div>
            <UPassword
              v-model="form.password"
              placeholder="Password"
              icon="i-heroicons-lock-closed-20-solid"
              size="lg"
              :ui="{ base: 'rounded-lg' }"
            />
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <input
                id="remember"
                v-model="form.rememberMe"
                type="checkbox"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded cursor-pointer"
              />
              <label for="remember" class="text-sm text-text-main cursor-pointer">
                Remember me
              </label>
            </div>
            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm text-primary hover:text-primary-strong font-medium"
            >
              Forgot Password?
            </NuxtLink>
          </div>

          <!-- Sign In Button -->
          <UButton type="submit" :loading="loading" size="lg" class="w-full mt-6">
            Sign In
          </UButton>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <!-- Google Sign In Button -->
          <UButton
            type="button"
            @click="handleGoogleSignIn"
            :loading="loading"
            size="lg"
            class="w-full"
            variant="soft"
            icon="i-mdi-google"
          >
            Sign in with Google
          </UButton>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-8 text-center text-sm text-text-main">
          Don't have an account?
          <NuxtLink to="/auth/signup" class="text-primary hover:text-primary-strong font-semibold">
            Sign Up
          </NuxtLink>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AuthForm } from '@/types/auth'
import { useAuthLogin } from '@/composables/auth/useAuthLogin'

// Define page metadata
definePageMeta({
  layout: 'blank' // Use a blank layout without header/footer
})

// Form state
const form = ref<AuthForm>({
  email: '',
  password: '',
  rememberMe: false
})

// Auth composable
const { loading, error, handleSignIn, handleGoogleSignIn } = useAuthLogin()

/**
 * Handle form submission
 */
const onSubmit = async (): Promise<void> => {
  // Basic validation
  if (!form.value.email || !form.value.password) {
    // TODO: Show validation error via toast or inline message
    console.warn('Please fill in all fields')
    return
  }

  // Call sign-in function from composable
  await handleSignIn(form.value)
}
</script>

<style scoped lang="postcss">
/* Custom styles specific to the login page */

/* Smooth transitions for password visibility toggle */
:deep(.group-focus-within \:ring-2) {
  @apply transition-all duration-200 ease-out;
}

/* Gradient background animation on decorative shape */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.decorative-shape {
  animation: float 6s ease-in-out infinite;
}

/* Focus state styling for inputs */
:deep(.u-input input:focus) {
  @apply ring-2 ring-blue-500 ring-offset-0;
}

/* Button hover effects */
:deep(.u-button:hover) {
  @apply transition-all duration-200;
}
</style>
