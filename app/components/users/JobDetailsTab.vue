<template>
  <div class="space-y-6">
    <!-- Contact Details -->
    <FormSection
      title="Contact Details"
      icon="i-heroicons-phone-20-solid"
      color="purple"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UFormField label="Phone Number" name="phone">
            <UInput
              v-model="form.phone"
              type="tel"
              placeholder="+1 (555) 987-6543"
              icon="i-heroicons-phone-20-solid"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Personal Email" name="personalEmail">
            <UInput
              v-model="form.personalEmail"
              type="email"
              placeholder="personal@email.com"
              icon="i-heroicons-envelope-20-solid"
            />
          </UFormField>
        </div>

        <div class="md:col-span-2">
          <UFormField label="Street Address" name="streetAddress">
            <UInput
              v-model="form.streetAddress"
              placeholder="123 Main Street"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="City" name="city">
            <UInput
              v-model="form.city"
              placeholder="New York"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="State / Province" name="state">
            <UInput
              v-model="form.state"
              placeholder="NY"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="ZIP / Postal Code" name="zipCode">
            <UInput
              v-model="form.zipCode"
              placeholder="10001"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Country" name="country">
            <USelect
              v-model="form.country"
              :options="countryOptions"
              placeholder="United States"
            />
          </UFormField>
        </div>
      </div>
    </FormSection>

    <!-- Job Information -->
    <FormSection
      title="Job Information"
      icon="i-heroicons-briefcase-20-solid"
      color="indigo"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UFormField label="Job Title" name="jobTitle" required>
            <UInput
              v-model="form.jobTitle"
              placeholder="Software Engineer"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Department" name="department" required>
            <USelect
              v-model="form.department"
              :options="departmentOptions"
              placeholder="Select department"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Employment Type" name="employmentType">
            <USelect
              v-model="form.employmentType"
              :options="employmentTypeOptions"
              placeholder="Select type"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Hire Date" name="hireDate">
            <UInput
              v-model="form.hireDate"
              type="date"
              icon="i-heroicons-calendar-20-solid"
            />
          </UFormField>
        </div>
      </div>
    </FormSection>
  </div>
</template>

<script setup lang="ts">
interface JobDetailsForm {
  phone: string
  personalEmail: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string
  jobTitle: string
  department: string
  employmentType: string
  hireDate: string
}

interface JobDetailsTabProps {
  form: JobDetailsForm
}

defineProps<JobDetailsTabProps>()

// Options
const countryOptions = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Other']
const departmentOptions = ['Engineering', 'Human Resources', 'Marketing', 'Operations', 'IT', 'Finance', 'Sales']
const employmentTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Intern']
</script>
