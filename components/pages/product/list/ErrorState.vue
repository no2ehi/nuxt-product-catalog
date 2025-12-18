<script setup lang="ts">
defineProps<{
  title?: string;
  message?: string;
}>();

const emit = defineEmits<{
  (e: "retry"): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16" role="alert" aria-live="assertive">
    <svg
      class="mb-4 h-16 w-16 text-red-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h2 class="mb-2 text-lg font-semibold text-slate-900">
      {{ title || "Something went wrong" }}
    </h2>
    <p class="mb-4 text-slate-600">
      {{ message || "We couldn't load the products. Please try again." }}
    </p>
    <button
      class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      @click="emit('retry')"
    >
      Retry
    </button>
  </div>
</template>
