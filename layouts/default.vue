<script setup lang="ts">
import AppHeader from "~/components/layout/AppHeader.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
</script>

<template>
  <div>
    <!-- Skip Navigation Link for keyboard and screen reader users -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>

    <AppHeader />

    <main id="main-content" class="mx-auto sm:container">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
