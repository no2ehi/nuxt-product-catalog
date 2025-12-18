<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>

<template>
  <header class="border-b border-slate-200 bg-white" aria-label="Page header">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 class="mb-4 text-center text-2xl sm:text-4xl font-bold text-slate-900">
        {{ title || "Unusual Products Catalog" }}
      </h1>
      <p class="mx-auto max-w-2xl text-center text-slate-600">
        {{
          description ||
          "Discover the weird, wonderful, and downright bizarre products you never knew you needed. From backwards clocks to edible laptops, we've got your unusual needs covered."
        }}
      </p>
    </div>
  </header>
</template>
