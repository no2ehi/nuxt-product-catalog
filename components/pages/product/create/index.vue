<script setup lang="ts">
import { ref, computed } from "vue";
import type { Product, ProductDimensions } from "~/types/product.type";
import { useProducts } from "~/composables/useProducts.composable";
import Input from "~/components/ui/Input.vue";
import Button from "~/components/ui/Button.vue";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";

const router = useRouter();
const { create, categoryList } = useProducts();

// Created product (for showing result after mock API call)
const createdProduct = ref<Product | null>(null);

// Load categories
const { data: categoriesData } = categoryList();

// Form state
const formData = ref<Partial<Product>>({
  title: "",
  description: "",
  category: "",
  price: 0,
  discountPercentage: 0,
  rating: 0,
  stock: 0,
  tags: [],
  brand: "",
  sku: "",
  weight: 0,
  dimensions: {
    width: 0,
    height: 0,
    depth: 0,
  } as ProductDimensions,
  warrantyInformation: "",
  shippingInformation: "",
  availabilityStatus: "In Stock" as const,
  returnPolicy: "",
  minimumOrderQuantity: 1,
  thumbnail: "",
  images: [],
});

// Form validation errors
const errors = ref<Record<string, string>>({});

// Loading state
const isSubmitting = ref(false);

// Tags input
const tagInput = ref("");

// Image URLs input
const imageInput = ref("");

// Validation
const validateForm = (): boolean => {
  errors.value = {};

  if (!formData.value.title?.trim()) {
    errors.value.title = "Title is required";
  }

  if (!formData.value.description?.trim()) {
    errors.value.description = "Description is required";
  }

  if (!formData.value.category?.trim()) {
    errors.value.category = "Category is required";
  }

  if (formData.value.price === undefined || formData.value.price < 0) {
    errors.value.price = "Price must be a positive number";
  }

  if (
    formData.value.discountPercentage !== undefined &&
    (formData.value.discountPercentage < 0 || formData.value.discountPercentage > 100)
  ) {
    errors.value.discountPercentage = "Discount must be between 0 and 100";
  }

  if (formData.value.stock === undefined || formData.value.stock < 0) {
    errors.value.stock = "Stock must be a non-negative number";
  }

  if (!formData.value.brand?.trim()) {
    errors.value.brand = "Brand is required";
  }

  if (!formData.value.sku?.trim()) {
    errors.value.sku = "SKU is required";
  }

  if (formData.value.weight === undefined || formData.value.weight < 0) {
    errors.value.weight = "Weight must be a positive number";
  }

  if (
    formData.value.dimensions &&
    (formData.value.dimensions.width < 0 ||
      formData.value.dimensions.height < 0 ||
      formData.value.dimensions.depth < 0)
  ) {
    errors.value.dimensions = "All dimensions must be positive numbers";
  }

  if (
    formData.value.minimumOrderQuantity !== undefined &&
    formData.value.minimumOrderQuantity < 1
  ) {
    errors.value.minimumOrderQuantity = "Minimum order quantity must be at least 1";
  }

  return Object.keys(errors.value).length === 0;
};

// Add tag
const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !formData.value.tags?.includes(tag)) {
    if (!formData.value.tags) {
      formData.value.tags = [];
    }
    formData.value.tags.push(tag);
    tagInput.value = "";
  }
};

// Remove tag
const removeTag = (index: number) => {
  if (formData.value.tags) {
    formData.value.tags.splice(index, 1);
  }
};

// Add image URL
const addImage = () => {
  const url = imageInput.value.trim();
  if (url && !formData.value.images?.includes(url)) {
    if (!formData.value.images) {
      formData.value.images = [];
    }
    formData.value.images.push(url);
    imageInput.value = "";
  }
};

// Remove image
const removeImage = (index: number) => {
  if (formData.value.images) {
    formData.value.images.splice(index, 1);
  }
};

// Submit form
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Prepare payload - remove empty arrays and null values
    const payload: Partial<Product> = {
      ...formData.value,
      tags: formData.value.tags && formData.value.tags.length > 0 ? formData.value.tags : undefined,
      images:
        formData.value.images && formData.value.images.length > 0
          ? formData.value.images
          : undefined,
    };

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key as keyof Product] === undefined || payload[key as keyof Product] === null) {
        delete payload[key as keyof Product];
      }
    });

    const result = await create(payload);

    if (result) {
      // Store the created product to show the result
      createdProduct.value = result;
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create product. Please try again.";
    errors.value.submit = message;
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form
const handleReset = () => {
  formData.value = {
    title: "",
    description: "",
    category: "",
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    tags: [],
    brand: "",
    sku: "",
    weight: 0,
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
    } as ProductDimensions,
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: "In Stock" as const,
    returnPolicy: "",
    minimumOrderQuantity: 1,
    thumbnail: "",
    images: [],
  };
  errors.value = {};
  tagInput.value = "";
  imageInput.value = "";
  createdProduct.value = null;
};

// Create another product
const createAnother = () => {
  handleReset();
};

// Format price for display
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Calculate discounted price
const discountedPrice = computed(() => {
  if (createdProduct.value && createdProduct.value.discountPercentage > 0) {
    return createdProduct.value.price * (1 - createdProduct.value.discountPercentage / 100);
  }
  return null;
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-8">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <!-- Success View - Show after product is created -->
      <div v-if="createdProduct" class="space-y-6">
        <!-- Success Alert -->
        <div class="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div class="flex items-start gap-3">
            <svg
              class="h-6 w-6 flex-shrink-0 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 class="text-lg font-semibold text-amber-800">Simulated Request</h3>
              <p class="mt-1 text-sm text-amber-700">
                This is a <strong>mock API response</strong>. The product was not actually saved to
                a database. This demonstration shows the data you submitted along with a simulated
                ID ({{ createdProduct.id }}) generated by the API.
              </p>
            </div>
          </div>
        </div>

        <!-- Success Header -->
        <div class="rounded-lg bg-green-50 p-6 text-center">
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
          >
            <svg
              class="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-green-800">Product Created Successfully!</h1>
          <p class="mt-2 text-green-600">Your product has been submitted to the API.</p>
        </div>

        <!-- Product Preview Card -->
        <div class="overflow-hidden rounded-lg bg-white shadow-sm">
          <div class="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 class="text-lg font-semibold text-slate-900">Product Preview</h2>
          </div>

          <div class="p-6">
            <div class="grid gap-6 md:grid-cols-2">
              <!-- Left Column - Image & Basic Info -->
              <div class="space-y-4">
                <!-- Thumbnail -->
                <div
                  v-if="createdProduct.thumbnail"
                  class="aspect-square overflow-hidden rounded-lg bg-slate-100"
                >
                  <img
                    :src="createdProduct.thumbnail"
                    :alt="createdProduct.title"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="flex aspect-square items-center justify-center rounded-lg bg-slate-100"
                >
                  <svg
                    class="h-16 w-16 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <!-- Tags -->
                <div
                  v-if="createdProduct.tags && createdProduct.tags.length > 0"
                  class="flex flex-wrap gap-2"
                >
                  <Badge v-for="tag in createdProduct.tags" :key="tag" variant="secondary">
                    {{ tag }}
                  </Badge>
                </div>
              </div>

              <!-- Right Column - Details -->
              <div class="space-y-4">
                <!-- Title & Category -->
                <div>
                  <p class="text-sm text-slate-500">{{ createdProduct.category }}</p>
                  <h3 class="text-xl font-bold text-slate-900">{{ createdProduct.title }}</h3>
                </div>

                <!-- Brand & SKU -->
                <div class="flex gap-4 text-sm">
                  <span class="text-slate-600">
                    Brand: <strong>{{ createdProduct.brand }}</strong>
                  </span>
                  <span class="text-slate-600">
                    SKU: <strong>{{ createdProduct.sku }}</strong>
                  </span>
                </div>

                <!-- Price -->
                <div class="flex items-center gap-2">
                  <span v-if="discountedPrice" class="text-2xl font-bold text-slate-900">
                    {{ formatPrice(discountedPrice) }}
                  </span>
                  <span
                    :class="[
                      discountedPrice
                        ? 'text-lg text-slate-400 line-through'
                        : 'text-2xl font-bold text-slate-900',
                    ]"
                  >
                    {{ formatPrice(createdProduct.price) }}
                  </span>
                  <Badge v-if="createdProduct.discountPercentage > 0" variant="destructive">
                    -{{ createdProduct.discountPercentage }}%
                  </Badge>
                </div>

                <!-- Description -->
                <p class="text-slate-600">{{ createdProduct.description }}</p>

                <!-- Stock & Availability -->
                <div class="flex gap-4">
                  <Badge
                    :variant="
                      createdProduct.availabilityStatus === 'In Stock'
                        ? 'default'
                        : createdProduct.availabilityStatus === 'Low Stock'
                          ? 'secondary'
                          : 'destructive'
                    "
                  >
                    {{ createdProduct.availabilityStatus }}
                  </Badge>
                  <span class="text-sm text-slate-600">
                    Stock: {{ createdProduct.stock }} units
                  </span>
                </div>

                <!-- Additional Info -->
                <div class="space-y-2 border-t border-slate-200 pt-4 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-500">Weight:</span>
                    <span class="text-slate-900">{{ createdProduct.weight }} kg</span>
                  </div>
                  <div v-if="createdProduct.dimensions" class="flex justify-between">
                    <span class="text-slate-500">Dimensions:</span>
                    <span class="text-slate-900">
                      {{ createdProduct.dimensions.width }} ×
                      {{ createdProduct.dimensions.height }} ×
                      {{ createdProduct.dimensions.depth }} cm
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Min. Order:</span>
                    <span class="text-slate-900"
                      >{{ createdProduct.minimumOrderQuantity }} units</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Policies Section -->
            <div
              v-if="
                createdProduct.warrantyInformation ||
                createdProduct.shippingInformation ||
                createdProduct.returnPolicy
              "
              class="mt-6 grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-3"
            >
              <div v-if="createdProduct.warrantyInformation">
                <h4 class="text-sm font-medium text-slate-900">Warranty</h4>
                <p class="mt-1 text-sm text-slate-600">{{ createdProduct.warrantyInformation }}</p>
              </div>
              <div v-if="createdProduct.shippingInformation">
                <h4 class="text-sm font-medium text-slate-900">Shipping</h4>
                <p class="mt-1 text-sm text-slate-600">{{ createdProduct.shippingInformation }}</p>
              </div>
              <div v-if="createdProduct.returnPolicy">
                <h4 class="text-sm font-medium text-slate-900">Returns</h4>
                <p class="mt-1 text-sm text-slate-600">{{ createdProduct.returnPolicy }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- API Response Card -->
        <div class="overflow-hidden rounded-lg bg-white shadow-sm">
          <div class="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 class="text-lg font-semibold text-slate-900">API Response (Raw JSON)</h2>
          </div>
          <div class="p-6">
            <pre
              class="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-green-400"
            ><code>{{ JSON.stringify(createdProduct, null, 2) }}</code></pre>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <Button block @click="createAnother"> Create Another Product </Button>
          <Button variant="outline" @click="router.push('/')"> Back to Products </Button>
        </div>
      </div>

      <!-- Form View - Show when no product is created yet -->
      <template v-else>
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900">Create New Product</h1>
          <p class="mt-2 text-slate-600">Fill in the details to create a new product</p>
        </div>

        <!-- Form -->
        <form class="space-y-8" @submit.prevent="handleSubmit">
          <!-- Basic Information -->
          <div class="rounded-lg bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-semibold text-slate-900">Basic Information</h2>
            <div class="space-y-4">
              <!-- Title -->
              <div>
                <label for="title" class="mb-2 block text-sm font-medium text-slate-700">
                  Title <span class="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  v-model="formData.title"
                  type="text"
                  placeholder="Enter product title"
                  :invalid="!!errors.title"
                  size="lg"
                />
                <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="mb-2 block text-sm font-medium text-slate-700">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="4"
                  placeholder="Enter product description"
                  :class="[
                    'flex w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                    errors.description
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : 'border-slate-300',
                  ]"
                />
                <p v-if="errors.description" class="mt-1 text-sm text-red-600">
                  {{ errors.description }}
                </p>
              </div>

              <!-- Category -->
              <div>
                <label for="category" class="mb-2 block text-sm font-medium text-slate-700">
                  Category <span class="text-red-500">*</span>
                </label>
                <Select v-model="formData.category" :invalid="!!errors.category">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="category in categoriesData"
                      :key="category"
                      :value="category"
                    >
                      {{ category }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p v-if="errors.category" class="mt-1 text-sm text-red-600">
                  {{ errors.category }}
                </p>
              </div>

              <!-- Brand -->
              <div>
                <label for="brand" class="mb-2 block text-sm font-medium text-slate-700">
                  Brand <span class="text-red-500">*</span>
                </label>
                <Input
                  id="brand"
                  v-model="formData.brand"
                  type="text"
                  placeholder="Enter brand name"
                  :invalid="!!errors.brand"
                  size="lg"
                />
                <p v-if="errors.brand" class="mt-1 text-sm text-red-600">{{ errors.brand }}</p>
              </div>

              <!-- SKU -->
              <div>
                <label for="sku" class="mb-2 block text-sm font-medium text-slate-700">
                  SKU <span class="text-red-500">*</span>
                </label>
                <Input
                  id="sku"
                  v-model="formData.sku"
                  type="text"
                  placeholder="Enter SKU"
                  :invalid="!!errors.sku"
                  size="lg"
                />
                <p v-if="errors.sku" class="mt-1 text-sm text-red-600">{{ errors.sku }}</p>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="rounded-lg bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-semibold text-slate-900">Pricing</h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <!-- Price -->
              <div>
                <label for="price" class="mb-2 block text-sm font-medium text-slate-700">
                  Price <span class="text-red-500">*</span>
                </label>
                <Input
                  id="price"
                  v-model.number="formData.price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  :invalid="!!errors.price"
                  size="lg"
                />
                <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
              </div>

              <!-- Discount Percentage -->
              <div>
                <label
                  for="discountPercentage"
                  class="mb-2 block text-sm font-medium text-slate-700"
                >
                  Discount Percentage (%)
                </label>
                <Input
                  id="discountPercentage"
                  v-model.number="formData.discountPercentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0"
                  :invalid="!!errors.discountPercentage"
                  size="lg"
                />
                <p v-if="errors.discountPercentage" class="mt-1 text-sm text-red-600">
                  {{ errors.discountPercentage }}
                </p>
              </div>

              <!-- Rating -->
              <div>
                <label for="rating" class="mb-2 block text-sm font-medium text-slate-700">
                  Rating
                </label>
                <Input
                  id="rating"
                  v-model.number="formData.rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="0"
                  size="lg"
                />
              </div>
            </div>
          </div>

          <!-- Inventory -->
          <div class="rounded-lg bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-semibold text-slate-900">Inventory</h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <!-- Stock -->
              <div>
                <label for="stock" class="mb-2 block text-sm font-medium text-slate-700">
                  Stock <span class="text-red-500">*</span>
                </label>
                <Input
                  id="stock"
                  v-model.number="formData.stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  :invalid="!!errors.stock"
                  size="lg"
                />
                <p v-if="errors.stock" class="mt-1 text-sm text-red-600">{{ errors.stock }}</p>
              </div>

              <!-- Availability Status -->
              <div>
                <label
                  for="availabilityStatus"
                  class="mb-2 block text-sm font-medium text-slate-700"
                >
                  Availability Status
                </label>
                <Select v-model="formData.availabilityStatus">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Stock">In Stock</SelectItem>
                    <SelectItem value="Low Stock">Low Stock</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Minimum Order Quantity -->
              <div>
                <label
                  for="minimumOrderQuantity"
                  class="mb-2 block text-sm font-medium text-slate-700"
                >
                  Minimum Order Quantity
                </label>
                <Input
                  id="minimumOrderQuantity"
                  v-model.number="formData.minimumOrderQuantity"
                  type="number"
                  min="1"
                  placeholder="1"
                  :invalid="!!errors.minimumOrderQuantity"
                  size="lg"
                />
                <p v-if="errors.minimumOrderQuantity" class="mt-1 text-sm text-red-600">
                  {{ errors.minimumOrderQuantity }}
                </p>
              </div>
            </div>
          </div>

          <!-- Physical Attributes -->
          <div class="rounded-lg bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-semibold text-slate-900">Physical Attributes</h2>
            <div class="space-y-4">
              <!-- Weight -->
              <div>
                <label for="weight" class="mb-2 block text-sm font-medium text-slate-700">
                  Weight (kg) <span class="text-red-500">*</span>
                </label>
                <Input
                  id="weight"
                  v-model.number="formData.weight"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  :invalid="!!errors.weight"
                  size="lg"
                />
                <p v-if="errors.weight" class="mt-1 text-sm text-red-600">{{ errors.weight }}</p>
              </div>

              <!-- Dimensions -->
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700">
                  Dimensions (cm)
                </label>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label for="width" class="mb-1 block text-xs text-slate-600">Width</label>
                    <Input
                      id="width"
                      v-model.number="formData.dimensions!.width"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0"
                      size="md"
                    />
                  </div>
                  <div>
                    <label for="height" class="mb-1 block text-xs text-slate-600">Height</label>
                    <Input
                      id="height"
                      v-model.number="formData.dimensions!.height"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0"
                      size="md"
                    />
                  </div>
                  <div>
                    <label for="depth" class="mb-1 block text-xs text-slate-600">Depth</label>
                    <Input
                      id="depth"
                      v-model.number="formData.dimensions!.depth"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0"
                      size="md"
                    />
                  </div>
                </div>
                <p v-if="errors.dimensions" class="mt-1 text-sm text-red-600">
                  {{ errors.dimensions }}
                </p>
              </div>
            </div>
          </div>

          <!-- Media -->
          <div class="rounded-lg bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-semibold text-slate-900">Media</h2>
            <div class="space-y-4">
              <!-- Thumbnail -->
              <div>
                <label for="thumbnail" class="mb-2 block text-sm font-medium text-slate-700">
                  Thumbnail URL
                </label>
                <Input
                  id="thumbnail"
                  v-model="formData.thumbnail"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  size="lg"
                />
              </div>

              <!-- Images -->
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700">Image URLs</label>
                <div class="flex gap-2">
                  <Input
                    v-model="imageInput"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    size="lg"
                    class="flex-1"
                    @keyup.enter="addImage"
                  />
                  <Button type="button" @click="addImage">Add</Button>
                </div>
                <div v-if="formData.images && formData.images.length > 0" class="mt-3 space-y-2">
                  <div
                    v-for="(image, index) in formData.images"
                    :key="index"
                    class="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2"
                  >
                    <span class="truncate text-sm text-slate-700">{{ image }}</span>
                    <Button type="button" variant="ghost" size="sm" @click="removeImage(index)">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="rounded-lg bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-semibold text-slate-900">Tags</h2>
            <div class="space-y-4">
              <div class="flex gap-2">
                <Input
                  v-model="tagInput"
                  type="text"
                  placeholder="Enter a tag and press Enter"
                  size="lg"
                  class="flex-1"
                  @keyup.enter="addTag"
                />
                <Button type="button" @click="addTag">Add</Button>
              </div>
              <div v-if="formData.tags && formData.tags.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                >
                  {{ tag }}
                  <button
                    type="button"
                    class="ml-1 text-blue-600 hover:text-blue-800"
                    @click="removeTag(index)"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- Policies -->
          <div class="rounded-lg bg-white p-6 shadow-sm">
            <h2 class="mb-6 text-xl font-semibold text-slate-900">Policies & Information</h2>
            <div class="space-y-4">
              <!-- Warranty Information -->
              <div>
                <label
                  for="warrantyInformation"
                  class="mb-2 block text-sm font-medium text-slate-700"
                >
                  Warranty Information
                </label>
                <textarea
                  id="warrantyInformation"
                  v-model="formData.warrantyInformation"
                  rows="3"
                  placeholder="Enter warranty information"
                  class="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                />
              </div>

              <!-- Shipping Information -->
              <div>
                <label
                  for="shippingInformation"
                  class="mb-2 block text-sm font-medium text-slate-700"
                >
                  Shipping Information
                </label>
                <textarea
                  id="shippingInformation"
                  v-model="formData.shippingInformation"
                  rows="3"
                  placeholder="Enter shipping information"
                  class="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                />
              </div>

              <!-- Return Policy -->
              <div>
                <label for="returnPolicy" class="mb-2 block text-sm font-medium text-slate-700">
                  Return Policy
                </label>
                <textarea
                  id="returnPolicy"
                  v-model="formData.returnPolicy"
                  rows="3"
                  placeholder="Enter return policy"
                  class="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errors.submit" class="rounded-lg bg-red-50 p-4">
            <p class="text-sm text-red-600">{{ errors.submit }}</p>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-4">
            <Button type="submit" :loading="isSubmitting" :disabled="isSubmitting" block>
              Create Product
            </Button>
            <Button type="button" variant="outline" :disabled="isSubmitting" @click="handleReset">
              Reset
            </Button>
            <Button
              type="button"
              variant="ghost"
              :disabled="isSubmitting"
              @click="router.push('/')"
            >
              Cancel
            </Button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>
