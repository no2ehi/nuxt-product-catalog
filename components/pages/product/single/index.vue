<script setup lang="ts">
import { computed } from "vue";
import Badge from "~/components/ui/badge/Badge.vue";
import Button from "~/components/ui/Button.vue";
import { useProducts } from "~/composables/useProducts.composable";

const route = useRoute();
const router = useRouter();

const productId = computed(() => Number(route.params.id));

const { get } = useProducts();
const swrResult = get(productId.value);
const { data: product, pending, error } = swrResult;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const discountedPrice = computed(() => {
  if (product.value && product.value.discountPercentage > 0) {
    return product.value.price * (1 - product.value.discountPercentage / 100);
  }
  return null;
});

const availabilityVariant = computed(() => {
  if (!product.value) return "outline";
  switch (product.value.availabilityStatus) {
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

const goBack = () => {
  router.push("/");
};

// Accessibility: Rating aria-label
const ratingAriaLabel = computed(() => {
  if (!product.value) return "";
  return `Rating: ${product.value.rating.toFixed(1)} out of 5 stars, ${product.value.reviews?.length || 0} reviews`;
});

// Accessibility: Price aria-label
const priceAriaLabel = computed(() => {
  if (!product.value) return "";
  if (discountedPrice.value) {
    return `Price: ${formatPrice(discountedPrice.value)}, originally ${formatPrice(product.value.price)}, ${product.value.discountPercentage}% off`;
  }
  return `Price: ${formatPrice(product.value.price)}`;
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div
      v-if="pending"
      class="flex min-h-screen items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading product details"
    >
      <div class="text-center">
        <svg
          class="mx-auto h-12 w-12 animate-spin text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
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
        <p class="mt-4 text-slate-600">Loading product...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex min-h-screen flex-col items-center justify-center px-4"
      role="alert"
      aria-live="assertive"
    >
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
      <h1 class="mb-2 text-lg font-semibold text-slate-900">Product not found</h1>
      <p class="mb-4 text-slate-600">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Button @click="goBack">Back to Products</Button>
    </div>

    <!-- Product Detail -->
    <article v-else-if="product" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <Button
        variant="ghost"
        size="sm"
        class="mb-6"
        aria-label="Go back to products list"
        @click="goBack"
      >
        <svg
          class="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Products
      </Button>

      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Product Images -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div
            class="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
          >
            <img
              :src="product.thumbnail"
              :alt="`${product.title} - Main product image`"
              class="h-full w-full object-cover"
            />
          </div>

          <!-- Additional Images -->
          <div
            v-if="product.images && product.images.length > 0"
            class="grid grid-cols-4 gap-4"
            role="group"
            aria-label="Additional product images"
          >
            <div
              v-for="(image, index) in product.images.slice(0, 4)"
              :key="index"
              class="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <img
                :src="image"
                :alt="`${product.title} - Additional image ${index + 1} of ${Math.min(product.images.length, 4)}`"
                class="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Category and Tags -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm text-slate-600">{{ product.category }}</span>
            <span
              v-if="product.tags && product.tags.length > 0"
              class="text-slate-300"
              aria-hidden="true"
              >|</span
            >
            <Badge v-for="tag in product.tags" :key="tag" variant="secondary" class="text-xs">
              {{ tag }}
            </Badge>
          </div>

          <!-- Title -->
          <h1 class="text-3xl font-bold text-slate-900">{{ product.title }}</h1>

          <!-- Rating -->
          <div class="flex items-center gap-2" role="img" :aria-label="ratingAriaLabel">
            <div class="flex items-center" aria-hidden="true">
              <span
                v-for="i in renderStars(product.rating).fullStars"
                :key="`full-${i}`"
                class="text-yellow-400"
              >
                ★
              </span>
              <span v-if="renderStars(product.rating).hasHalfStar" class="text-yellow-400">
                ☆
              </span>
              <span
                v-for="i in renderStars(product.rating).emptyStars"
                :key="`empty-${i}`"
                class="text-slate-300"
              >
                ★
              </span>
            </div>
            <span class="text-slate-600" aria-hidden="true">
              {{ product.rating.toFixed(1) }} ({{ product.reviews?.length || 0 }}
              reviews)
            </span>
          </div>

          <!-- Price -->
          <div class="flex items-center gap-3" :aria-label="priceAriaLabel">
            <span
              v-if="discountedPrice"
              class="text-3xl font-bold text-slate-900"
              aria-hidden="true"
            >
              {{ formatPrice(discountedPrice) }}
            </span>
            <span
              :class="[
                'text-3xl font-bold',
                discountedPrice ? 'text-lg text-slate-500 line-through' : 'text-slate-900',
              ]"
              :aria-hidden="discountedPrice ? 'true' : undefined"
            >
              {{ formatPrice(product.price) }}
            </span>
            <Badge
              v-if="product.discountPercentage > 0"
              variant="destructive"
              class="text-sm"
              aria-hidden="true"
            >
              -{{ product.discountPercentage }}% OFF
            </Badge>
            <span class="sr-only">{{ priceAriaLabel }}</span>
          </div>

          <!-- Availability -->
          <div>
            <Badge
              :variant="availabilityVariant"
              class="text-sm"
              role="status"
              :aria-label="`Availability: ${product.availabilityStatus}`"
            >
              {{ product.availabilityStatus }}
            </Badge>
            <p v-if="product.stock > 0" class="mt-1 text-sm text-slate-600">
              {{ product.stock }} items in stock
            </p>
          </div>

          <!-- Description -->
          <section aria-labelledby="description-heading">
            <h2 id="description-heading" class="mb-2 text-lg font-semibold text-slate-900">
              Description
            </h2>
            <p class="text-slate-600">{{ product.description }}</p>
          </section>

          <!-- Product Details -->
          <section
            class="space-y-4 border-t border-slate-200 pt-6"
            aria-labelledby="details-heading"
          >
            <h2 id="details-heading" class="text-lg font-semibold text-slate-900">
              Product Details
            </h2>

            <dl class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt class="font-medium text-slate-900">Product Code (SKU)</dt>
                <dd class="text-slate-600">{{ product.sku }}</dd>
              </div>

              <div>
                <dt class="font-medium text-slate-900">Brand</dt>
                <dd class="text-slate-600">{{ product.brand }}</dd>
              </div>

              <div v-if="product.weight">
                <dt class="font-medium text-slate-900">Weight</dt>
                <dd class="text-slate-600">{{ product.weight }} kg</dd>
              </div>

              <div v-if="product.dimensions">
                <dt class="font-medium text-slate-900">Dimensions</dt>
                <dd class="text-slate-600">
                  {{ product.dimensions.width }} × {{ product.dimensions.height }} ×
                  {{ product.dimensions.depth }} cm
                </dd>
              </div>

              <div v-if="product.minimumOrderQuantity">
                <dt class="font-medium text-slate-900">Minimum Order</dt>
                <dd class="text-slate-600">{{ product.minimumOrderQuantity }} units</dd>
              </div>
            </dl>
          </section>

          <!-- Shipping & Warranty -->
          <section
            v-if="product.shippingInformation || product.warrantyInformation"
            class="space-y-4 border-t border-slate-200 pt-6"
            aria-label="Shipping and warranty information"
          >
            <div v-if="product.shippingInformation">
              <h3 class="mb-2 font-semibold text-slate-900">Shipping Information</h3>
              <p class="text-sm text-slate-600">
                {{ product.shippingInformation }}
              </p>
            </div>

            <div v-if="product.warrantyInformation">
              <h3 class="mb-2 font-semibold text-slate-900">Warranty Information</h3>
              <p class="text-sm text-slate-600">
                {{ product.warrantyInformation }}
              </p>
            </div>
          </section>

          <!-- Return Policy -->
          <section
            v-if="product.returnPolicy"
            class="border-t border-slate-200 pt-6"
            aria-labelledby="return-heading"
          >
            <h3 id="return-heading" class="mb-2 font-semibold text-slate-900">Return Policy</h3>
            <p class="text-sm text-slate-600">{{ product.returnPolicy }}</p>
          </section>

          <!-- Reviews -->
          <section
            v-if="product.reviews && product.reviews.length > 0"
            class="border-t border-slate-200 pt-6"
            aria-labelledby="reviews-heading"
          >
            <h2 id="reviews-heading" class="mb-4 text-lg font-semibold text-slate-900">
              Reviews ({{ product.reviews.length }})
            </h2>
            <ul class="space-y-4" role="list" aria-label="Customer reviews">
              <li
                v-for="(review, index) in product.reviews"
                :key="index"
                class="rounded-lg border border-slate-200 p-4"
              >
                <div class="mb-2 flex items-center justify-between">
                  <div>
                    <p class="font-medium text-slate-900">
                      {{ review.reviewerName }}
                    </p>
                    <p class="text-xs text-slate-600">
                      <time :datetime="review.date">{{ review.date }}</time>
                    </p>
                  </div>
                  <div
                    class="flex items-center"
                    role="img"
                    :aria-label="`Rating: ${review.rating} out of 5 stars`"
                  >
                    <span
                      v-for="i in 5"
                      :key="i"
                      :class="i <= review.rating ? 'text-yellow-400' : 'text-slate-300'"
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  </div>
                </div>
                <p class="text-sm text-slate-600">{{ review.comment }}</p>
              </li>
            </ul>
          </section>

          <!-- Meta Information -->
          <footer
            v-if="product.meta"
            class="border-t border-slate-200 pt-6 text-xs text-slate-600"
            aria-label="Product metadata"
          >
            <p>Barcode: {{ product.meta.barcode }}</p>
            <p v-if="product.meta.createdAt">
              Added:
              <time :datetime="product.meta.createdAt">
                {{ new Date(product.meta.createdAt).toLocaleDateString() }}
              </time>
            </p>
            <p v-if="product.meta.updatedAt">
              Updated:
              <time :datetime="product.meta.updatedAt">
                {{ new Date(product.meta.updatedAt).toLocaleDateString() }}
              </time>
            </p>
          </footer>
        </div>
      </div>
    </article>
  </div>
</template>
