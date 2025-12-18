<script setup lang="ts">
defineProps<{
  loading?: boolean;
}>();
</script>

<template>
  <div class="mt-8 flex justify-center">
    <div
      v-if="loading"
      class="py-8"
      role="status"
      aria-live="polite"
      aria-label="Loading more products"
    >
      <div class="flex items-center gap-2 text-slate-600">
        <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span>Loading more products...</span>
      </div>
    </div>
  </div>
</template>
