<template>
  <header
    class="header"
    :class="{
      'header--scrolled': layout.isHeaderScrolled,
      'header--sticky': layout.isHeaderSticky,
    }"
  >
    <!-- Main Container -->
    <div class="header__container">
      <!-- Left Section: Menu Toggle + Search -->
      <div class="header__left">
        <!-- Mobile Menu Toggle -->
        <button
          class="header__menu-toggle"
          @click="layout.toggleSidebar"
          :aria-label="layout.isSidebarOpen ? 'Close menu' : 'Open menu'"
        >
          <svg class="header__menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path v-if="!layout.isSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Search Bar -->
        <div class="header__search">
          <div class="header__search-input-wrapper">
            <svg class="header__search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
            <input
              type="text"
              class="header__search-input"
              placeholder="Search tasks, projects..."
              @focus="layout.toggleSearch"
              @blur="layout.toggleSearch"
            />
          </div>
        </div>
      </div>

      <!-- Right Section: Timer, Notifications, Profile -->
      <div class="header__right">
        <!-- Timer Widget -->
        <div class="header__timer">
          <svg class="header__timer-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm.5-9H9V7a1 1 0 112 0v2.5a1 1 0 01-1.5.866z" clip-rule="evenodd" />
          </svg>
          <span class="header__timer-text">00:15:23</span>
          <button class="header__timer-stop" title="Stop timer">
            <svg class="header__timer-stop-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 100 2h4a1 1 0 100-2H8z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Notifications -->
        <div class="header__notifications">
          <button
            class="header__icon-button"
            @click="layout.toggleNotifications"
            :aria-label="'Notifications' + (unreadNotifications > 0 ? ` (${unreadNotifications} new)` : '')"
          >
            <svg class="header__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="unreadNotifications > 0" class="header__badge">
              {{ unreadNotifications }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <Teleport v-if="notificationsOpen" to="body">
            <div class="header__dropdown-overlay" @click="layout.closeMenus" />
            <div class="header__dropdown header__notifications-dropdown">
              <div class="header__dropdown-header">
                <h3 class="header__dropdown-title">Notifications</h3>
              </div>
              <div class="header__dropdown-content">
                <div class="header__empty-state">
                  <p>No new notifications</p>
                </div>
              </div>
            </div>
          </Teleport>
        </div>

        <!-- Profile Menu -->
        <div class="header__profile">
          <button
            class="header__profile-button"
            @click="layout.toggleProfileMenu"
            :aria-label="userName || 'Profile menu'"
          >
            <img
              v-if="userAvatar"
              :src="userAvatar"
              :alt="userName"
              class="header__avatar"
            />
            <svg v-else class="header__avatar-placeholder" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <svg
              class="header__chevron"
              :class="{ 'header__chevron--open': profileMenuOpen }"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Profile Dropdown -->
          <Teleport v-if="profileMenuOpen" to="body">
            <div class="header__dropdown-overlay" @click="layout.closeMenus" />
            <div class="header__dropdown header__profile-dropdown">
              <div class="header__profile-card">
                <img
                  v-if="userAvatar"
                  :src="userAvatar"
                  :alt="userName"
                  class="header__profile-avatar"
                />
                <div>
                  <p class="header__profile-name">{{ userName || 'User' }}</p>
                  <p class="header__profile-email">{{ userEmail }}</p>
                  <p class="header__profile-role">{{ userRole }}</p>
                </div>
              </div>
              <div class="header__dropdown-divider" />
              <nav class="header__dropdown-menu">
                <NuxtLink to="/settings" class="header__dropdown-link">Settings</NuxtLink>
                <NuxtLink to="/profile" class="header__dropdown-link">Profile</NuxtLink>
                <NuxtLink to="/help" class="header__dropdown-link">Help & Support</NuxtLink>
              </nav>
              <div class="header__dropdown-divider" />
              <button class="header__dropdown-logout" @click="handleLogout">
                Logout
              </button>
            </div>
          </Teleport>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutState } from '~/composables/layout/useLayoutState'

const layout = useLayoutState()

// Computed state properties
const profileMenuOpen = computed(() => layout.state.value.header.profileMenuOpen)
const notificationsOpen = computed(() => layout.state.value.header.notificationsOpen)
const unreadNotifications = computed(() => layout.state.value.header.unreadNotifications)
const userName = computed(() => layout.state.value.header.user?.name)
const userEmail = computed(() => layout.state.value.header.user?.email)
const userAvatar = computed(() => layout.state.value.header.user?.avatar)
const userRole = computed(() => layout.state.value.header.user?.role)

const handleLogout = async () => {
  layout.closeMenus()
  console.log('Logout clicked')
}
</script>

<style scoped lang="postcss">
/* =========================================
   HEADER COMPONENT - STYLES
========================================= */

.header {
  --header-bg: rgb(var(--color-surface));
  --header-border: rgb(var(--color-border-subtle));
  --header-text: rgb(var(--color-text-main));
  --header-text-muted: rgb(var(--color-text-muted));
  --header-icon: rgb(var(--color-slate-600));
  --header-icon-hover: rgb(var(--color-primary));

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  transition: all var(--transition-fast);
  height: var(--layout-header-height);

  @media (max-width: 768px) {
    height: 60px;
  }
}

.header--sticky {
  box-shadow: var(--shadow-xs);
}

.header--scrolled {
  box-shadow: var(--shadow-sm);
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
  gap: 24px;
  max-width: var(--layout-content-max-width);
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 16px;
    gap: 16px;
  }
}

/* Left Section */
.header__left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.header__menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--header-icon);
  border-radius: calc(var(--radius-md) - 4px);
  transition: all var(--transition-fast);

  &:hover {
    background-color: rgba(var(--color-primary), 0.08);
    color: var(--header-icon-hover);
  }

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.header__menu-icon {
  width: 24px;
  height: 24px;
}

/* Search Bar */
.header__search {
  flex: 1;
  max-width: 500px;
  display: block;

  @media (max-width: 768px) {
    max-width: none;
  }
}

.header__search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background-color: rgb(var(--color-surface-alt));
  border: 1px solid rgb(var(--color-border-subtle));
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:focus-within {
    border-color: rgb(var(--color-primary));
    box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.08);
  }
}

.header__search-icon {
  width: 18px;
  height: 18px;
  color: var(--header-text-muted);
  flex-shrink: 0;
}

.header__search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--header-text);
  font-size: 14px;

  &::placeholder {
    color: var(--header-text-muted);
  }
}

/* Right Section */
.header__right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* Timer Widget */
.header__timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(var(--color-primary), 0.08);
  border-radius: var(--radius-md);
  border: 1px solid rgba(var(--color-primary), 0.15);

  @media (max-width: 768px) {
    display: none;
  }
}

.header__timer-icon {
  width: 18px;
  height: 18px;
  color: rgb(var(--color-primary));
  flex-shrink: 0;
}

.header__timer-text {
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--color-primary));
  line-height: 1;
}

.header__timer-stop {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: rgb(220, 38, 38);
  border-radius: 4px;
  transition: all var(--transition-fast);

  &:hover {
    background-color: rgba(220, 38, 38, 0.08);
  }
}

.header__timer-stop-icon {
  width: 14px;
  height: 14px;
}

/* Notifications & Profile Buttons */
.header__notifications,
.header__profile {
  position: relative;
}

.header__icon-button,
.header__profile-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--header-icon);
  border-radius: calc(var(--radius-md) - 4px);
  transition: all var(--transition-fast);
  position: relative;

  &:hover {
    background-color: rgba(var(--color-primary), 0.08);
    color: var(--header-icon-hover);
  }
}

.header__icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
}

.header__badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--ui-color-error-500));
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: var(--radius-full);
  border: 2px solid var(--header-bg);
}

/* Profile Button */
.header__profile-button {
  gap: 8px;
  padding: 6px 12px;
  background-color: rgba(var(--color-primary), 0.08);

  &:hover {
    background-color: rgba(var(--color-primary), 0.12);
  }
}

.header__avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  object-fit: cover;
  flex-shrink: 0;
}

.header__avatar-placeholder {
  width: 24px;
  height: 24px;
  color: rgb(var(--color-primary));
  flex-shrink: 0;
}

.header__chevron {
  width: 16px;
  height: 16px;
  color: var(--header-text-muted);
  transition: transform var(--transition-fast);
}

.header__chevron--open {
  transform: rotate(180deg);
}

/* Dropdown Overlay */
.header__dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 49;
}

/* Dropdown Menu */
.header__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background-color: var(--header-bg);
  border: 1px solid var(--header-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-medium);
  z-index: 50;
  animation: slideDown var(--transition-fast) ease-out;

  @media (max-width: 400px) {
    width: calc(100vw - 32px);
    right: 16px;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header__notifications-dropdown {
  min-width: 360px;

  @media (max-width: 400px) {
    min-width: unset;
  }
}

.header__profile-dropdown {
  width: 340px;

  @media (max-width: 400px) {
    width: unset;
  }
}

.header__dropdown-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--header-border);
}

.header__dropdown-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--header-text);
  margin: 0;
}

.header__dropdown-content {
  max-height: 400px;
  overflow-y: auto;
}

.header__empty-state {
  padding: 32px 20px;
  text-align: center;
  color: var(--header-text-muted);
  font-size: 14px;
}

/* Profile Card */
.header__profile-card {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--header-border);
}

.header__profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  object-fit: cover;
  flex-shrink: 0;
}

.header__profile-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--header-text);
  margin: 0 0 4px 0;
}

.header__profile-email {
  font-size: 13px;
  color: var(--header-text-muted);
  margin: 0 0 2px 0;
}

.header__profile-role {
  font-size: 12px;
  color: rgb(var(--color-primary));
  margin: 0;
  font-weight: 500;
}

/* Dropdown Divider */
.header__dropdown-divider {
  height: 1px;
  background-color: var(--header-border);
}

/* Dropdown Menu */
.header__dropdown-menu {
  padding: 8px 0;
}

.header__dropdown-link {
  display: block;
  padding: 10px 20px;
  color: var(--header-text);
  text-decoration: none;
  font-size: 14px;
  transition: all var(--transition-fast);

  &:hover {
    background-color: rgb(var(--color-surface-alt));
    color: rgb(var(--color-primary));
  }
}

.header__dropdown-logout {
  width: 100%;
  padding: 10px 20px;
  background: none;
  border: none;
  color: rgb(var(--ui-color-error-500));
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background-color: rgba(var(--ui-color-error-500), 0.08);
  }
}
</style>
