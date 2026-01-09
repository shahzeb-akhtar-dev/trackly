<template>
  <div class="space-y-6">
    <!-- Emergency Contact -->
    <FormSection
      title="Emergency Contact"
      icon="i-heroicons-shield-exclamation-20-solid"
      color="orange"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UFormField label="Contact Name" name="emergencyContactName">
            <UInput
              v-model="form.emergencyContactName"
              placeholder="Jane Doe"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Contact Phone" name="emergencyContactPhone">
            <UInput
              v-model="form.emergencyContactPhone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              icon="i-heroicons-phone-20-solid"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Relationship" name="emergencyContactRelationship">
            <UInput
              v-model="form.emergencyContactRelationship"
              placeholder="Spouse"
            />
          </UFormField>
        </div>
      </div>
    </FormSection>

    <!-- Permissions -->
    <FormSection
      title="Permissions"
      icon="i-heroicons-lock-closed-20-solid"
      color="red"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UFormField label="Role" name="role" required>
            <USelect
              v-model="form.role"
              :options="roleOptions"
              placeholder="Select role"
            />
          </UFormField>
        </div>

        <div>
          <UFormField label="Status" name="status">
            <USelect
              v-model="form.status"
              :options="statusOptions"
              placeholder="Select status"
            />
          </UFormField>
        </div>
      </div>
    </FormSection>
  </div>
</template>

<script setup lang="ts">
interface PermissionsForm {
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  role: string
  status: string
}

interface PermissionsTabProps {
  form: PermissionsForm
}

defineProps<PermissionsTabProps>()

// Options
const roleOptions = ['Administrator', 'Manager', 'Editor', 'Viewer', 'Admin']
const statusOptions = ['active', 'inactive', 'pending']
</script>
