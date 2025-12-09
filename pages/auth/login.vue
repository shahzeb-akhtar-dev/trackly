<template>
  <div class="h-full font-display bg-white dark:bg-background-dark flex items-center justify-center p-4">
    <div class="w-full max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 rounded-xl shadow-2xl overflow-hidden">
        <div class="left-bg p-12 text-white relative flex-col justify-center items-start hidden md:flex rounded-l-xl rounded-r-d-shape">
          <div class="absolute top-0 left-0 w-full h-full opacity-10" style="background-image: radial-gradient(circle at 10% 20%, rgba(255,255,255,0.2) 0%, transparent 40%), radial-gradient(circle at 80% 90%, rgba(255,255,255,0.15) 0%, transparent 35%);"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-8">
              <!-- logo -->
              <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-3xl font-bold tracking-wider">Trackly</span>
            </div>
            <h1 class="text-5xl font-bold tracking-tight mb-4 leading-tight">Welcome Back</h1>
            <p class="text-lg font-normal text-blue-100 max-w-md">Your gateway to seamless productivity and project management. Log in to continue your journey.</p>
          </div>
          <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute -top-10 -left-16 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-8 sm:p-12 flex flex-col justify-center rounded-r-xl">
          <div class="w-full max-w-md mx-auto">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign in to Trackly</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-8">Enter your details below to access your account.</p>

            <form @submit.prevent class="space-y-6">
              <div>
                <label class="sr-only" for="email">Email/Username</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <Icon name="mdi:account" width="20" height="20" />
                  </span>
                  <input id="email" name="email" type="text" placeholder="Email / Username" class="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                </div>
              </div>

              <div>
                <label class="sr-only" for="password">Password</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <Icon name="mdi:lock" width="20" height="20" />
                  </span>
                  <input id="password" name="password" type="password" placeholder="Password" class="w-full pl-12 pr-16 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                  <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary hover:text-blue-700">SHOW</button>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-primary bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-primary" />
                  <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Remember me</label>
                </div>
                <div class="text-sm">
                  <a class="font-medium text-primary hover:text-blue-700" href="#">Forgot Password?</a>
                </div>
              </div>

              <div>
                <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 transition-colors">
                  Sign in
                </button>
              </div>
            </form>

            <div class="relative my-6">
              <div aria-hidden="true" class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>

            <div>
              <button type="button" class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 transition-colors">
                <!-- Google SVG -->
                <svg aria-hidden="true" class="w-5 h-5 mr-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"></path>
                  <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"></path>
                  <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"></path>
                  <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.138,44,30.022,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"></path>
                </svg>
                Sign in with Google
              </button>
            </div>

            <p class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">Don't have an account? <a class="font-medium text-primary hover:text-blue-700" href="#">Sign Up</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Trackly Login' })
</script>
