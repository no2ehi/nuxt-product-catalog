<script setup lang="ts">
import { ref, computed, watch, watchEffect, nextTick, onMounted } from "vue";
import type { ComponentPublicInstance } from "vue";
import { useDebounceFn } from "~/composables/useDebounceFn.composable";
import { useWindowVirtualizer } from "@tanstack/vue-virtual";
import { useInfiniteQuery } from "@tanstack/vue-query";
import type { SortOrder } from "~/types/response.type";
import type { Product, ProductsResponse } from "~/types/product.type";
import { useProducts } from "~/composables/useProducts.composable";
import { productsService } from "~/services/product.service";
import { SortOrderEnum } from "~/enums/SortOrder.enum";

// Components
import Header from "./Header.vue";
import SearchInput from "./SearchInput.vue";
import Filters from "./Filters.vue";
import LoadingSkeleton from "./LoadingSkeleton.vue";
import EmptyState from "./EmptyState.vue";
import NoResults from "./NoResults.vue";
import ErrorState from "./ErrorState.vue";
import ScrollToTop from "./ScrollToTop.vue";
import ProductCard from "../shared/Card.vue";

const { categoryList } = useProducts();
const productService = productsService();

// Search
const searchQuery = ref("");
const debouncedSearch = ref("");

// Filters
const selectedCategory = ref<string>("");
const priceSort = ref<"" | SortOrder>("");
const ratingSort = ref<"" | SortOrder>("");

// Categories
const { data: categoryListData } = categoryList();

// Pagination
const limit = ref(20);

// Helper to check if value is a valid SortOrder
const isValidSortOrder = (value: "" | SortOrder): value is SortOrder => {
  return value === SortOrderEnum.ASC || value === SortOrderEnum.DESC;
};

// Track if we have any active filters
const hasActiveFilters = computed(() => {
  return !!(
    debouncedSearch.value.trim() ||
    selectedCategory.value ||
    priceSort.value ||
    ratingSort.value
  );
});

// Fetch function for useInfiniteQuery
const fetchServerPage = async ({
  pageParam = 0,
}: {
  pageParam?: number;
}): Promise<{ products: Product[]; nextOffset: number | undefined; total: number }> => {
  const skip = pageParam * limit.value;

  let result: ProductsResponse | null = null;
  let totalProducts = 0;
  let isNonPaginated = false; // Search and category return all results at once

  if (debouncedSearch.value.trim()) {
    // Use search API directly - returns all results
    result = await productService.search(debouncedSearch.value);
    totalProducts = result?.total || 0;
    isNonPaginated = true;
  } else if (selectedCategory.value && selectedCategory.value !== "") {
    // Use service directly for category filter - returns all results
    result = await productService.getByCategory(selectedCategory.value);
    totalProducts = result?.total || 0;
    isNonPaginated = true;

    // Apply sorting if needed
    if (
      result?.products &&
      (isValidSortOrder(priceSort.value) || isValidSortOrder(ratingSort.value))
    ) {
      const sortBy = isValidSortOrder(priceSort.value) ? "price" : "rating";
      const order = isValidSortOrder(priceSort.value) ? priceSort.value : ratingSort.value;
      result.products = [...result.products].sort((a: Product, b: Product) => {
        const aVal = a[sortBy as keyof Product] as number;
        const bVal = b[sortBy as keyof Product] as number;
        return order === SortOrderEnum.ASC ? aVal - bVal : bVal - aVal;
      });
    }
  } else {
    // Use list API with filters (for sorting or load more)
    const filters: Record<string, unknown> = {
      limit: limit.value,
      skip,
    };

    if (isValidSortOrder(priceSort.value)) {
      filters.sortBy = "price";
      filters.order = priceSort.value;
    } else if (isValidSortOrder(ratingSort.value)) {
      filters.sortBy = "rating";
      filters.order = ratingSort.value;
    }

    result = await productService.list(filters);
    totalProducts = result?.total || 0;
  }

  const products = result?.products || [];

  // For non-paginated endpoints (search, category), only return first page
  if (isNonPaginated) {
    return {
      products: pageParam === 0 ? products : [],
      nextOffset: undefined, // No pagination for search/category
      total: totalProducts,
    };
  }

  // For paginated endpoints, check if there's more
  const currentTotal = skip + products.length;
  const hasMore = products.length === limit.value && currentTotal < totalProducts;

  return {
    products,
    nextOffset: hasMore ? pageParam + 1 : undefined,
    total: totalProducts,
  };
};

// Create query key based on filters
const queryKey = computed(() => [
  "products",
  debouncedSearch.value,
  selectedCategory.value,
  priceSort.value,
  ratingSort.value,
]);

// Use infinite query
const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } =
  useInfiniteQuery({
    queryKey,
    queryFn: fetchServerPage,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
  });

// Flatten all products from all pages
const allProducts = computed(() => (data.value ? data.value.pages.flatMap((d) => d.products) : []));

// Flag to prevent double fetch when clearing search programmatically
const isClearingSearch = ref(false);

// Debounced search
const debouncedSearchFn = useDebounceFn((value: string) => {
  debouncedSearch.value = value;
}, 500);

watch(searchQuery, (newValue) => {
  // If search is being cleared programmatically, don't fetch
  if (isClearingSearch.value) {
    return;
  }

  // Clear filters when searching (API doesn't support both)
  if (newValue) {
    selectedCategory.value = "";
    priceSort.value = "";
    ratingSort.value = "";
  }
  debouncedSearchFn(newValue);
});

// Watch filters - use separate watchers to avoid re-triggering when resetting sorts
// Handle mutual exclusion of sorts (only one sort can be active at a time)
watch(priceSort, (newValue) => {
  if (isValidSortOrder(newValue) && isValidSortOrder(ratingSort.value)) {
    ratingSort.value = "";
  }
});

watch(ratingSort, (newValue) => {
  if (isValidSortOrder(newValue) && isValidSortOrder(priceSort.value)) {
    priceSort.value = "";
  }
});

// Watch all filters and clear search when using filters (API doesn't support both)
watch(
  [selectedCategory, priceSort, ratingSort],
  ([newCategory, newPrice, newRating], [oldCategory, oldPrice, oldRating]) => {
    // Check if any filter actually changed (not just initialization)
    const categoryChanged = newCategory !== oldCategory;
    const priceChanged = newPrice !== oldPrice;
    const ratingChanged = newRating !== oldRating;

    // If a filter was activated (changed to a non-empty value), clear search
    if (
      (categoryChanged && newCategory) ||
      (priceChanged && newPrice) ||
      (ratingChanged && newRating)
    ) {
      // Set flag to prevent search watcher from triggering fetch
      isClearingSearch.value = true;
      searchQuery.value = "";
      debouncedSearch.value = "";
      // Reset flag after clearing (use nextTick to ensure watch has processed)
      nextTick(() => {
        isClearingSearch.value = false;
      });
    }
  },
  { flush: "post" } // Run after DOM updates to batch rapid changes
);

// Virtual scrolling setup
const parentRef = ref<HTMLElement | null>(null);
const parentOffsetRef = ref(0);

onMounted(() => {
  // Use nextTick to ensure DOM is fully rendered
  nextTick(() => {
    parentOffsetRef.value = parentRef.value?.offsetTop ?? 0;
  });
});

// Calculate items per row based on screen size (responsive grid)
const itemsPerRow = ref(4); // Default for xl screens

// Update items per row based on window size
const updateItemsPerRow = () => {
  if (typeof window === "undefined") return;
  const width = window.innerWidth;
  if (width < 640) {
    itemsPerRow.value = 1; // sm
  } else if (width < 1024) {
    itemsPerRow.value = 2; // md
  } else if (width < 1280) {
    itemsPerRow.value = 3; // lg
  } else {
    itemsPerRow.value = 4; // xl
  }
};

// Group products into rows
const productRows = computed(() => {
  const rows: Product[][] = [];
  for (let i = 0; i < allProducts.value.length; i += itemsPerRow.value) {
    rows.push(allProducts.value.slice(i, i + itemsPerRow.value));
  }
  // Add a loading row if there's more to load
  if (hasNextPage.value && allProducts.value.length > 0) {
    rows.push([]); // Empty row for loading indicator
  }
  return rows;
});

// Virtualizer options
const rowVirtualizerOptions = computed(() => {
  return {
    count: productRows.value.length,
    estimateSize: () => 400, // Estimated height of a product row
    scrollMargin: parentOffsetRef.value,
    overscan: 2,
  };
});

const rowVirtualizer = useWindowVirtualizer(rowVirtualizerOptions);

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems());

const totalSize = computed(() => rowVirtualizer.value.getTotalSize());

// Measure element function for dynamic sizing
const measureElement = (el: Element | ComponentPublicInstance | null) => {
  if (!el || !(el instanceof HTMLElement)) {
    return;
  }
  rowVirtualizer.value.measureElement(el);
};

// Watch for scroll to bottom and fetch next page
watchEffect(() => {
  const [lastItem] = [...virtualRows.value].reverse();

  if (!lastItem) {
    return;
  }

  if (
    lastItem.index >= productRows.value.length - 1 &&
    hasNextPage.value &&
    !isFetchingNextPage.value
  ) {
    fetchNextPage();
  }
});

// Update items per row on mount and resize
if (typeof window !== "undefined") {
  updateItemsPerRow();
  window.addEventListener("resize", updateItemsPerRow);
}

// Product count
const productCount = computed(() => allProducts.value.length);

// Loading state (initial load)
const isInitialLoading = computed(() => {
  return status.value === "pending" && allProducts.value.length === 0;
});

// Empty state
const isEmpty = computed(() => {
  return (
    status.value === "success" &&
    allProducts.value.length === 0 &&
    !debouncedSearch.value &&
    !selectedCategory.value
  );
});

// No results state
const noResults = computed(() => {
  return (
    status.value === "success" &&
    allProducts.value.length === 0 &&
    (debouncedSearch.value || selectedCategory.value)
  );
});

// Error state
const hasError = computed(() => status.value === "error");

// Clear all filters
const clearAllFilters = () => {
  isClearingSearch.value = true;
  searchQuery.value = "";
  debouncedSearch.value = "";
  selectedCategory.value = "";
  priceSort.value = "";
  ratingSort.value = "";
  nextTick(() => {
    isClearingSearch.value = false;
  });
};
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section -->
    <Header />

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Search Input -->
      <SearchInput v-model="searchQuery" />

      <!-- Filters -->
      <Filters
        v-model:category="selectedCategory"
        v-model:price-sort="priceSort"
        v-model:rating-sort="ratingSort"
        :categories="categoryListData || []"
      />

      <!-- Live region for screen reader announcements -->
      <div aria-live="polite" aria-atomic="true" class="sr-only" role="status">
        <template v-if="isInitialLoading || isFetching"> Loading products... </template>
        <template v-else-if="hasError"> Error loading products. Please try again. </template>
        <template v-else>
          {{ productCount }} product{{ productCount !== 1 ? "s" : "" }} found
        </template>
      </div>

      <!-- Product Count (visible) -->
      <div v-if="!isInitialLoading" class="mb-4 text-sm text-slate-600" aria-hidden="true">
        {{ productCount }} product{{ productCount !== 1 ? "s" : "" }} found
      </div>

      <!-- Loading State (Initial) -->
      <LoadingSkeleton v-if="isInitialLoading" />

      <!-- Empty State -->
      <EmptyState v-else-if="isEmpty" />

      <!-- No Results State -->
      <NoResults v-else-if="noResults" @clear="clearAllFilters" />

      <!-- Error State -->
      <ErrorState v-else-if="hasError" @retry="() => refetch()" />

      <!-- Products Grid with Virtual Scrolling -->
      <section v-else aria-label="Products list">
        <h2 class="sr-only">Products</h2>
        <div ref="parentRef" class="List">
          <div
            :style="{
              height: `${totalSize}px`,
              width: '100%',
              position: 'relative',
            }"
          >
            <div
              :style="{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${
                  (virtualRows[0]?.start ?? 0) - rowVirtualizer.options.scrollMargin
                }px)`,
              }"
            >
              <div
                v-for="virtualRow in virtualRows"
                :key="String(virtualRow.key)"
                :data-index="virtualRow.index"
                :ref="measureElement"
              >
                <div style="padding: 10px 0">
                  <template v-if="virtualRow.index >= productRows.length - 1 && hasNextPage">
                    <div class="flex items-center justify-center p-8">
                      <div v-if="isFetchingNextPage" class="text-slate-600">Loading more...</div>
                      <div v-else class="text-slate-600">Nothing more to load</div>
                    </div>
                  </template>
                  <template v-else>
                    <ul
                      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      role="list"
                      aria-label="Product cards"
                    >
                      <li
                        v-for="product in productRows[virtualRow.index]"
                        :key="product.id"
                        class="list-none"
                      >
                        <ProductCard :product="product" />
                      </li>
                    </ul>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="isFetching && !isFetchingNextPage"
          class="mt-4 text-center text-sm text-slate-600"
        >
          Background Updating...
        </div>
      </section>
    </div>

    <!-- Scroll to Top Button -->
    <ScrollToTop />
  </div>
</template>
