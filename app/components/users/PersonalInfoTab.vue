<template>
  <div class="space-y-6">
    <!-- Account Credentials -->
    <FormSection
      title="Account Credentials"
      icon="i-heroicons-identification-20-solid"
      color="blue"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <UFormField label="Work Email" name="email" required>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="user@company.com"
              icon="i-heroicons-envelope-20-solid"
              :disabled="disabled"
            />
          </UFormField>
        </div>

        <div v-if="showPasswordFields">
          <UFormField label="Password" name="password" required>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed-20-solid"
            />
          </UFormField>
        </div>

        <div v-if="showPasswordFields">
          <UFormField label="Confirm Password" name="confirmPassword" required>
            <UInput
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed-20-solid"
            />
          </UFormField>
        </div>
      </div>
    </FormSection>

    <!-- Identity -->
    <FormSection
      title="Identity"
      icon="i-heroicons-user-circle-20-solid"
      color="green"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UFormField label="First Name" name="firstName" required>
            <UInput
              v-model="form.firstName"
              placeholder="John"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Last Name" name="lastName" required>
            <UInput
              v-model="form.lastName"
              placeholder="Doe"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Date of Birth" name="dateOfBirth">
            <UInput
              v-model="form.dateOfBirth"
              type="date"
              icon="i-heroicons-calendar-20-solid"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Gender" name="gender">
            <USelect
              v-model="form.gender"
              :options="genderOptions"
              placeholder="Select..."
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Marital Status" name="maritalStatus">
            <USelect
              v-model="form.maritalStatus"
              :options="maritalStatusOptions"
              placeholder="Select..."
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Nationality" name="nationality">
            <UInput
              v-model="form.nationality"
              placeholder="United States"
            />
          </UFormField>
        </div>
      </div>
    </FormSection>
  </div>
</template>

<script setup lang="ts">
import FormSection from './FormSection.vue'

interface PersonalInfoForm {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  maritalStatus: string
  nationality: string
}

interface PersonalInfoTabProps {
  form: PersonalInfoForm
  disabled?: boolean
  showPasswordFields?: boolean
}

defineProps<PersonalInfoTabProps>()

// Options
const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say']
const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed']
</script>
