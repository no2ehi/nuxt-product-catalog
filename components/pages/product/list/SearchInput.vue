<script setup lang="ts">
import Input from "~/components/ui/Input.vue";

const model = defineModel<string>({ default: "" });

const emit = defineEmits<{
  (e: "clear"): void;
}>();

const clearSearch = () => {
  model.value = "";
  emit("clear");
};
</script>

<template>
  <div class="mb-6">
    <label for="product-search" class="sr-only">Search products</label>
    <Input
      id="product-search"
      v-model="model"
      placeholder="Search for unusual products..."
      size="lg"
      aria-describedby="search-description"
    >
      <template #icon-left>
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </template>
      <template #icon-right>
        <button
          v-if="model"
          type="button"
          class="pointer-events-auto flex items-center justify-center rounded-full bg-red-100 p-1 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Clear search"
          @click.stop.prevent="clearSearch"
        >
          <svg
            class="h-4 w-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </template>
    </Input>
    <span id="search-description" class="sr-only">
      Type to search products by name or description
    </span>
  </div>
</template>
