<script setup lang="ts">
defineProps<{
  title?: string;
  message?: string;
}>();

const emit = defineEmits<{
  (e: "clear"): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16" role="status" aria-live="polite">
    <svg
      class="mb-4 h-16 w-16 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h2 class="mb-2 text-lg font-semibold text-slate-900">
      {{ title || "No products found" }}
    </h2>
    <p class="mb-4 text-slate-600">
      {{ message || "Try adjusting your search or filters." }}
    </p>
    <button
      class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      @click="emit('clear')"
    >
      Clear Filters
    </button>
  </div>
</template>
