<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <PageHeader
      :title="isEditMode ? 'Edit User' : 'Create New User'"
      :description="isEditMode ? 'Update user information and permissions' : `Step ${currentStep} of 3 - ${steps[currentStep - 1].title}`"
    >
      <UButton
        icon="i-heroicons-arrow-left-20-solid"
        color="secondary"
        variant="ghost"
        @click="handleCancel"
      >
        Back to Users
      </UButton>
    </PageHeader>

    <!-- Main Content -->
    <div class="px-4 lg:px-6 py-6 lg:py-8">
      <!-- Loading State -->
      <LoadingState
        v-if="loading && isEditMode"
        message="Loading user data..."
        :allow-reload="true"
        :loading="loading"
        @reload="fetchUserData"
      />

      <!-- Error State -->
      <ErrorState
        v-else-if="error"
        title="Error loading user"
        :message="error"
        variant="error"
        :allow-retry="true"
        @retry="fetchUserData"
      />

      <!-- Form Content with Steps -->
      <div v-else class="w-full">
        <!-- Stepper (Create mode only) -->
        <UStepper
          v-if="!isEditMode"
          v-model="currentStep"
          :items="stepperItems"
          class="mb-6"
        />

        <UCard class="bg-transparent !shadow-none border-0">
          <!-- Step Content -->
          <div class="py-4">
            <!-- Step 1: Personal Info -->
            <PersonalInfoTab
              v-show="currentStep === 1 || isEditMode"
              :form="form"
              :disabled="isEditMode"
              :show-password-fields="!isEditMode"
            />
            
            <!-- Step 2: Job Details -->
            <JobDetailsTab
              v-show="currentStep === 2 || isEditMode"
              :form="form"
            />
            
            <!-- Step 3: Permissions -->
            <PermissionsTab
              v-show="currentStep === 3 || isEditMode"
              :form="form"
            />
          </div>

          <!-- Action Buttons -->
          <template #footer>
            <div class="flex items-center justify-between">
              <UButton
                color="secondary"
                variant="ghost"
                @click="handleCancel"
              >
                Cancel
              </UButton>

              <div class="flex items-center gap-3">
                <UButton
                  v-if="currentStep > 1 && !isEditMode"
                  color="secondary"
                  variant="outline"
                  icon="i-heroicons-arrow-left-20-solid"
                  @click="previousStep"
                >
                  Previous
                </UButton>

                <UButton
                  v-if="currentStep < 3 && !isEditMode"
                  color="primary"
                  icon-trailing="i-heroicons-arrow-right-20-solid"
                  @click="nextStep"
                >
                  Next Step
                </UButton>

                <UButton
                  v-if="currentStep === 3 || isEditMode"
                  color="primary"
                  :loading="submitting"
                  @click="handleSubmit"
                >
                  {{ isEditMode ? 'Update User' : 'Create User' }}
                </UButton>
              </div>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== IMPORTS =====
import { ref, computed, onMounted } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import PersonalInfoTab from '~/components/users/PersonalInfoTab.vue'
import JobDetailsTab from '~/components/users/JobDetailsTab.vue'
import PermissionsTab from '~/components/users/PermissionsTab.vue'
import PageHeader from '~/components/layout/PageHeader.vue'
import LoadingState from '~/components/common/LoadingState.vue'
import ErrorState from '~/components/common/ErrorState.vue'

// ===== ROUTER =====
const route = useRoute()
const router = useRouter()

// ===== MODE DETECTION =====
const userId = computed(() => route.params.userId as string)
const isEditMode = computed(() => userId.value !== 'addUser' && userId.value !== 'new')

// ===== LOCAL STATE =====
const currentStep = ref(1)
const loading = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)

// Form data
const form = ref({
  // Account
  email: '',
  password: '',
  confirmPassword: '',
  
  // Identity
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  nationality: '',
  
  // Contact
  phone: '',
  personalEmail: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  
  // Job
  jobTitle: '',
  department: '',
  employmentType: 'Full-time',
  hireDate: '',
  
  // Emergency
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  
  // Permissions
  role: 'Viewer',
  status: 'active',
})

// ===== STEPPER CONFIGURATION =====
const stepperItems = [
  {
    title: 'Personal Info',
    description: 'Account credentials and identity details',
    icon: 'i-heroicons-user-circle-20-solid',
    slot: 'personal',
  },
  {
    title: 'Job Details',
    description: 'Contact information and employment details',
    icon: 'i-heroicons-briefcase-20-solid',
    slot: 'job',
  },
  {
    title: 'Permissions',
    description: 'Emergency contact and user permissions',
    icon: 'i-heroicons-lock-closed-20-solid',
    slot: 'permissions',
  },
]

const steps = [
  { number: 1, title: 'Personal Info' },
  { number: 2, title: 'Job Details' },
  { number: 3, title: 'Permissions' },
]

// ===== VALIDATION SCHEMA =====
const validationSchema = z.object({
  // Account Credentials
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
  
  // Identity
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  maritalStatus: z.string().optional().or(z.literal('')),
  nationality: z.string().optional().or(z.literal('')),
  
  // Contact
  phone: z.string().optional().or(z.literal('')),
  personalEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  streetAddress: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  
  // Job
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  employmentType: z.string().optional().or(z.literal('')),
  hireDate: z.string().optional().or(z.literal('')),
  
  // Emergency
  emergencyContactName: z.string().optional().or(z.literal('')),
  emergencyContactPhone: z.string().optional().or(z.literal('')),
  emergencyContactRelationship: z.string().optional().or(z.literal('')),
  
  // Permissions
  role: z.string().min(1, 'Role is required'),
  status: z.string().optional().or(z.literal('')),
})

type Schema = z.infer<typeof validationSchema>

// ===== METHODS =====
/**
 * Move to next step
 */
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

/**
 * Move to previous stepevent: FormSubmitEvent<Schema>) => {
  submitting.value = true
  
  try {
    // Validate password match for create mode
    if (!isEditMode.value && event.data.password !== event.data.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Form submitted:', event.data)
    
    // Success - redirect back to users list
    navigateTo = true
  error.value = null

  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data for edit mode
    form.value = {
      email: 'john.doe@company.com',
      password: '',
      confirmPassword: '',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      gender: 'Male',
      maritalStatus: 'Married',
      nationality: 'United States',
      phone: '+1 (555) 987-6543',
      personalEmail: 'john.doe@personal.com',
      streetAddress: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      employmentType: 'Full-time',
      hireDate: '2023-01-15',
      emergencyContactName: 'Jane Doe',
      emergencyContactPhone: '+1 (555) 123-4567',
      emergencyContactRelationship: 'Spouse',
      role: 'Editor',
      status: 'active',
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load user data'
  } finally {
    loading.value = false
  }
}

/**
 * Cancel and navigate back to users list
 *navigateTo
const handleCancel = () => {
  router.push('/settings/users')
}

/**
 * Submit form (create or update user)
 */
const handleSubmit = async () => {
  submitting.value = true
  
  try {
    // TODO: Add validation
    if (!isEditMode.value && form.value.password !== form.value.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Success - redirect back to users list
    router.push('/settings/users')
  } catch (e: any) {
    error.value = e.message || 'Failed to save user'
  } finally {
    submitting.value = false
  }
}

// ===== LIFECYCLE =====
onMounted(async () => {
  if (isEditMode.value) {
    await fetchUserData()
  }
})
</script>
