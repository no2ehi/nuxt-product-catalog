<script setup lang="ts">
import CardSkeleton from "../shared/CardSkeleton.vue";

defineProps<{
  count?: number;
}>();
</script>

<template>
  <div
    class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    role="status"
    aria-busy="true"
    aria-label="Loading products"
  >
    <span class="sr-only">Loading products, please wait...</span>
    <CardSkeleton v-for="i in count || 8" :key="i" aria-hidden="true" />
  </div>
</template>
