<script setup lang="ts">
import type { Product } from "~/types/product.type";
import ProductCard from "../shared/Card.vue";

defineProps<{
  products: Product[];
}>();
</script>

<template>
  <ul
    class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    role="list"
    aria-label="Product cards"
  >
    <li v-for="product in products" :key="product.id" class="list-none">
      <ProductCard :product="product" />
    </li>
  </ul>
</template>
