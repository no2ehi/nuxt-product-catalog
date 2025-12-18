<script setup lang="ts">
import Skeleton from "~/components/ui/skeleton/Skeleton.vue";
</script>

<template>
  <div
    class="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    aria-hidden="true"
  >
    <!-- Image Skeleton -->
    <div class="relative aspect-square w-full overflow-hidden bg-slate-100">
      <Skeleton class="h-full w-full" />
    </div>

    <!-- Content Skeleton -->
    <div class="flex flex-1 flex-col p-4">
      <!-- Category Skeleton -->
      <Skeleton class="mb-1 h-3 w-20" />

      <!-- Title Skeleton -->
      <Skeleton class="mb-2 h-5 w-full" />
      <Skeleton class="mb-2 h-5 w-3/4" />

      <!-- Description Skeleton -->
      <Skeleton class="mb-3 h-4 w-full" />
      <Skeleton class="mb-3 h-4 w-5/6" />

      <!-- SKU Skeleton -->
      <Skeleton class="mb-2 h-3 w-24" />

      <!-- Rating Skeleton -->
      <div class="mb-3 flex items-center gap-1">
        <Skeleton class="h-4 w-20" />
      </div>

      <!-- Price and Badge Skeleton -->
      <div class="mt-auto space-y-2">
        <Skeleton class="h-6 w-24" />
        <Skeleton class="h-5 w-20" />
        <Skeleton class="mt-2 h-9 w-full" />
      </div>
    </div>
  </div>
</template>
