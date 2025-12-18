<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "~/types/product.type";
import Badge from "~/components/ui/badge/Badge.vue";
import Button from "~/components/ui/Button.vue";

const props = defineProps<{
  product: Product;
}>();

const router = useRouter();

const goToDetail = () => {
  router.push(`/products/${props.product.id}`);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const discountedPrice = computed(() => {
  if (props.product.discountPercentage > 0) {
    return props.product.price * (1 - props.product.discountPercentage / 100);
  }
  return null;
});

const availabilityVariant = computed(() => {
  switch (props.product.availabilityStatus) {
    case "In Stock":
      return "default";
    case "Low Stock":
      return "secondary";
    case "Out of Stock":
      return "destructive";
    default:
      return "outline";
  }
});

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return { fullStars, hasHalfStar, emptyStars };
};

const stars = computed(() => renderStars(props.product.rating));

// Accessibility: Rating aria-label
const ratingAriaLabel = computed(() => {
  return `Rating: ${props.product.rating.toFixed(1)} out of 5 stars`;
});

// Accessibility: Price aria-label
const priceAriaLabel = computed(() => {
  if (discountedPrice.value) {
    return `Price: ${formatPrice(discountedPrice.value)}, originally ${formatPrice(props.product.price)}, ${props.product.discountPercentage}% off`;
  }
  return `Price: ${formatPrice(props.product.price)}`;
});
</script>

<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
    :aria-labelledby="`product-title-${product.id}`"
  >
    <!-- Product Image -->
    <div class="relative aspect-square w-full overflow-hidden bg-slate-100">
      <img
        :src="product.thumbnail"
        :alt="`${product.title} - ${product.category} product image`"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />

      <!-- Discount Badge -->
      <div
        v-if="product.discountPercentage > 0"
        class="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white"
        role="status"
        :aria-label="`${product.discountPercentage}% discount`"
      >
        <span aria-hidden="true">-{{ product.discountPercentage }}%</span>
      </div>

      <!-- Tag Badge -->
      <div v-if="product.tags && product.tags.length > 0" class="absolute right-2 top-2">
        <Badge variant="default" class="text-xs">
          {{ product.tags[0] }}
        </Badge>
      </div>
    </div>

    <!-- Product Info -->
    <div class="flex flex-1 flex-col p-4">
      <!-- Category -->
      <div class="mb-1">
        <span class="text-xs text-slate-600">{{ product.category }}</span>
      </div>

      <!-- Product Name -->
      <h3
        :id="`product-title-${product.id}`"
        class="mb-2 line-clamp-2 text-base font-semibold text-slate-900"
      >
        {{ product.title }}
      </h3>

      <!-- Description -->
      <p class="mb-3 line-clamp-2 text-sm text-slate-600">
        {{ product.description }}
      </p>

      <!-- Product Code (SKU) -->
      <div class="mb-2 text-xs text-slate-600">
        <span class="sr-only">Product code:</span>
        Code: {{ product.sku }}
      </div>

      <!-- Rating -->
      <div class="mb-3 flex items-center gap-1" role="img" :aria-label="ratingAriaLabel">
        <div class="flex items-center" aria-hidden="true">
          <span v-for="i in stars.fullStars" :key="`full-${i}`" class="text-yellow-400">★</span>
          <span v-if="stars.hasHalfStar" class="text-yellow-400">☆</span>
          <span v-for="i in stars.emptyStars" :key="`empty-${i}`" class="text-slate-300">★</span>
        </div>
        <span class="ml-1 text-sm text-slate-600" aria-hidden="true">
          ({{ product.rating.toFixed(1) }})
        </span>
      </div>

      <!-- Price and Availability -->
      <div class="mt-auto space-y-2">
        <!-- Price -->
        <div class="flex items-center gap-2" :aria-label="priceAriaLabel">
          <span v-if="discountedPrice" class="text-lg font-bold text-slate-900" aria-hidden="true">
            {{ formatPrice(discountedPrice) }}
          </span>
          <span
            :class="[
              'text-lg font-bold',
              discountedPrice ? 'text-sm text-slate-500 line-through' : 'text-slate-900',
            ]"
            :aria-hidden="discountedPrice ? 'true' : undefined"
          >
            {{ formatPrice(product.price) }}
          </span>
          <span class="sr-only">{{ priceAriaLabel }}</span>
        </div>

        <!-- Availability Badge -->
        <div>
          <Badge
            :variant="availabilityVariant"
            class="text-xs"
            role="status"
            :aria-label="`Availability: ${product.availabilityStatus}`"
          >
            {{ product.availabilityStatus }}
          </Badge>
        </div>

        <!-- View More Button -->
        <Button
          variant="outline"
          size="sm"
          block
          class="mt-2"
          :aria-label="`View details for ${product.title}`"
          @click="goToDetail"
        >
          View More
        </Button>
      </div>
    </div>
  </article>
</template>
