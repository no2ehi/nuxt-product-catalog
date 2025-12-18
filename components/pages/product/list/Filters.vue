<script setup lang="ts">
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { SortOrderEnum } from "~/enums/SortOrder.enum";
import type { SortOrder } from "~/types/response.type";

defineProps<{
  categories: string[];
}>();

const selectedCategory = defineModel<string>("category", { default: "" });
const priceSort = defineModel<"" | SortOrder>("priceSort", { default: "" });
const ratingSort = defineModel<"" | SortOrder>("ratingSort", { default: "" });
</script>

<template>
  <div class="mb-6 flex flex-wrap gap-4" role="group" aria-label="Filter and sort options">
    <!-- Category Filter -->
    <div class="relative min-w-[180px]">
      <label for="category-filter" class="sr-only">Filter by category</label>
      <Select id="category-filter" v-model="selectedCategory" class="w-full">
        <SelectTrigger aria-label="Select category filter">
          <div class="flex flex-1 items-center gap-2">
            <svg
              class="h-4 w-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <SelectValue placeholder="All Categories" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Categories</SelectItem>
          <SelectItem v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </SelectItem>
        </SelectContent>
      </Select>
      <button
        v-if="selectedCategory"
        type="button"
        class="absolute right-8 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-red-100 p-1 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Clear category filter"
        @click.stop="selectedCategory = ''"
      >
        <svg
          class="h-3.5 w-3.5 text-red-600"
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
    </div>

    <!-- Price Sort -->
    <div class="relative min-w-[180px]">
      <label for="price-sort" class="sr-only">Sort by price</label>
      <Select id="price-sort" v-model="priceSort" class="w-full">
        <SelectTrigger aria-label="Select price sorting">
          <div class="flex flex-1 items-center gap-2">
            <svg
              class="h-4 w-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            <SelectValue placeholder="Price" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Price</SelectItem>
          <SelectItem :value="SortOrderEnum.ASC">Price (Low to High)</SelectItem>
          <SelectItem :value="SortOrderEnum.DESC">Price (High to Low)</SelectItem>
        </SelectContent>
      </Select>
      <button
        v-if="priceSort"
        type="button"
        class="absolute right-8 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-red-100 p-1 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Clear price sort"
        @click.stop="priceSort = ''"
      >
        <svg
          class="h-3.5 w-3.5 text-red-600"
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
    </div>

    <!-- Rating Sort -->
    <div class="relative min-w-[180px]">
      <label for="rating-sort" class="sr-only">Sort by rating</label>
      <Select id="rating-sort" v-model="ratingSort" class="w-full">
        <SelectTrigger aria-label="Select rating sorting">
          <div class="flex flex-1 items-center gap-2">
            <svg
              class="h-4 w-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <SelectValue placeholder="Rating" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Rating</SelectItem>
          <SelectItem :value="SortOrderEnum.DESC">Rating (High to Low)</SelectItem>
          <SelectItem :value="SortOrderEnum.ASC">Rating (Low to High)</SelectItem>
        </SelectContent>
      </Select>
      <button
        v-if="ratingSort"
        type="button"
        class="absolute right-8 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-red-100 p-1 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Clear rating sort"
        @click.stop="ratingSort = ''"
      >
        <svg
          class="h-3.5 w-3.5 text-red-600"
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
    </div>
  </div>
</template>
