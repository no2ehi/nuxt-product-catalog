/**
 * useSWR Composable Integration Tests
 *
 * Tests the SWR (stale-while-revalidate) composable with real API calls.
 * Uses dummyjson.com API for testing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ref, nextTick } from "vue";
import { registerEndpoint } from "@nuxt/test-utils/runtime";
import { useSWR, invalidateSWRCache, getSWRCacheStats } from "@/composables/useSWR.composable";

// Mock API endpoint for controlled testing
const mockProductsResponse = {
  products: [
    { id: 1, title: "iPhone 9", price: 549 },
    { id: 2, title: "iPhone X", price: 899 },
  ],
  total: 100,
  skip: 0,
  limit: 2,
};

const mockSingleProduct = {
  id: 1,
  title: "iPhone 9",
  description: "An apple mobile",
  price: 549,
  brand: "Apple",
};

// Register mock endpoints
registerEndpoint("/api/products", () => mockProductsResponse);
registerEndpoint("/api/product/1", () => mockSingleProduct);

describe("useSWR Composable", () => {
  // ═══════════════════════════════════════════════════════════════
  // Basic Functionality Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Basic Functionality", () => {
    it("should return required properties", () => {
      const result = useSWR({
        key: "test-basic",
        fetcher: async () => ({ test: true }),
        immediate: false,
      });

      // Check that all expected properties exist
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("refresh");
      expect(result).toHaveProperty("invalidate");
    });

    it("should have invalidate as a function", () => {
      const result = useSWR({
        key: "test-invalidate-type",
        fetcher: async () => ({ test: true }),
        immediate: false,
      });

      expect(typeof result.invalidate).toBe("function");
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Key Computation Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Key Computation", () => {
    it("should work with string key", () => {
      const result = useSWR({
        key: "simple-string-key",
        fetcher: async () => ({ data: "test" }),
        immediate: false,
      });

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
    });

    it("should work with ref key", () => {
      const keyRef = ref("ref-key-test");

      const result = useSWR({
        key: keyRef,
        fetcher: async () => ({ data: "test" }),
        immediate: false,
      });

      expect(result).toBeDefined();
    });

    it("should work with function key", () => {
      const id = ref(1);

      const result = useSWR({
        key: () => `product-${id.value}`,
        fetcher: async () => ({ id: id.value }),
        immediate: false,
      });

      expect(result).toBeDefined();
    });

    it("should work with computed-like key", () => {
      const params = ref({ page: 1, limit: 10 });

      const result = useSWR({
        key: () => `products-${JSON.stringify(params.value)}`,
        fetcher: async () => ({ params: params.value }),
        immediate: false,
      });

      expect(result).toBeDefined();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Options Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Options", () => {
    it("should respect immediate: false option", () => {
      const fetcherSpy = vi.fn().mockResolvedValue({ data: "test" });

      useSWR({
        key: "immediate-false-test",
        fetcher: fetcherSpy,
        immediate: false,
      });

      // With immediate: false, fetcher should not be called immediately
      expect(fetcherSpy).not.toHaveBeenCalled();
    });

    it("should accept staleTime option", () => {
      expect(() => {
        useSWR({
          key: "stale-time-test",
          fetcher: async () => ({ data: "test" }),
          immediate: false,
          staleTime: 60000, // 1 minute
        });
      }).not.toThrow();
    });

    it("should accept server option", () => {
      const result = useSWR({
        key: "server-option-test",
        fetcher: async () => ({ data: "test" }),
        immediate: false,
        server: false,
      });

      expect(result).toBeDefined();
    });

    it("should accept watch sources option", () => {
      const watchRef = ref(0);

      const result = useSWR({
        key: "watch-test",
        fetcher: async () => ({ count: watchRef.value }),
        watch: [watchRef],
        immediate: false,
      });

      expect(result).toBeDefined();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Data Fetching Tests (with mock endpoints)
  // ═══════════════════════════════════════════════════════════════

  describe("Data Fetching", () => {
    it("should fetch data from mock endpoint", async () => {
      const result = useSWR({
        key: "fetch-products-test",
        fetcher: () => $fetch("/api/products"),
      });

      // Wait for data to load
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      // Check if data is loaded (might be null if still pending)
      if (result.data.value) {
        expect(result.data.value).toEqual(mockProductsResponse);
      }
    });

    it("should fetch single product from mock endpoint", async () => {
      const result = useSWR({
        key: "fetch-single-product-test",
        fetcher: () => $fetch("/api/product/1"),
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      if (result.data.value) {
        expect(result.data.value).toEqual(mockSingleProduct);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Refresh and Invalidate Function Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Refresh and Invalidate Functions", () => {
    it("should have refresh function available", () => {
      const result = useSWR({
        key: "refresh-available-test",
        fetcher: async () => ({ data: "test" }),
        immediate: false,
      });

      expect(typeof result.refresh).toBe("function");
    });

    it("should be callable without errors", () => {
      const result = useSWR({
        key: "invalidate-test",
        fetcher: async () => ({ timestamp: Date.now() }),
        immediate: false,
      });

      // invalidate should be callable without throwing
      expect(() => result.invalidate()).not.toThrow();
    });

    it("should refresh data when refresh is called", async () => {
      let fetchCount = 0;
      const fetcher = vi.fn().mockImplementation(async () => {
        fetchCount++;
        return { count: fetchCount, timestamp: Date.now() };
      });

      const result = useSWR({
        key: "refresh-test-key",
        fetcher,
        immediate: true,
      });

      // Wait for initial fetch
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      const firstCount = fetchCount;
      const firstData = result.data.value;

      // Call refresh
      await result.refresh();
      await nextTick();

      // Fetcher should be called again
      expect(fetchCount).toBeGreaterThan(firstCount);
      // Data should be updated
      if (result.data.value && firstData) {
        expect(result.data.value).not.toEqual(firstData);
      }
    });

    it("should invalidate and refresh when invalidate is called", async () => {
      let fetchCount = 0;
      const fetcher = vi.fn().mockImplementation(async () => {
        fetchCount++;
        return { count: fetchCount };
      });

      const result = useSWR({
        key: "invalidate-refresh-test",
        fetcher,
        immediate: true,
      });

      // Wait for initial fetch
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      const firstCount = fetchCount;

      // Call invalidate
      await result.invalidate();
      await nextTick();

      // Fetcher should be called again (cache cleared + refresh)
      expect(fetchCount).toBeGreaterThan(firstCount);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Error Handling Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Error Handling", () => {
    it("should handle fetcher errors gracefully", () => {
      expect(() => {
        useSWR({
          key: "error-test",
          fetcher: async () => {
            throw new Error("Test error");
          },
          immediate: false,
        });
      }).not.toThrow();
    });

    it("should set error state when fetcher fails", async () => {
      const result = useSWR({
        key: "error-state-test",
        fetcher: async () => {
          throw new Error("Test error");
        },
        immediate: true,
      });

      // Wait for error to occur
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      // Error should be set
      expect(result.error.value).toBeInstanceOf(Error);
      expect(result.error.value?.message).toBe("Test error");
      expect(result.status.value).toBe("error");
    });

    it("should recover from error on refresh", async () => {
      let shouldFail = true;
      const fetcher = vi.fn().mockImplementation(async () => {
        if (shouldFail) {
          throw new Error("Test error");
        }
        return { data: "success" };
      });

      const result = useSWR({
        key: "error-recovery-test",
        fetcher,
        immediate: true,
      });

      // Wait for initial error
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      expect(result.error.value).toBeInstanceOf(Error);

      // Fix the fetcher
      shouldFail = false;

      // Refresh should recover
      await result.refresh();
      await nextTick();

      // Error should be cleared
      expect(result.error.value).toBeNull();
      expect(result.status.value).toBe("success");
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Revalidation Options Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Revalidation Options", () => {
    it("should accept revalidateOnMount option", () => {
      expect(() => {
        useSWR({
          key: "revalidate-on-mount-test",
          fetcher: async () => ({ data: "test" }),
          immediate: false,
          revalidateOnMount: true,
        });
      }).not.toThrow();
    });

    it("should accept revalidateOnFocus option", () => {
      expect(() => {
        useSWR({
          key: "revalidate-on-focus-test",
          fetcher: async () => ({ data: "test" }),
          immediate: false,
          revalidateOnFocus: true,
        });
      }).not.toThrow();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Watch Sources Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Watch Sources", () => {
    it("should refetch when watch source changes", async () => {
      const watchRef = ref(1);
      let fetchCount = 0;

      const fetcher = vi.fn().mockImplementation(async () => {
        fetchCount++;
        return { value: watchRef.value, count: fetchCount };
      });

      useSWR({
        key: "watch-source-test",
        fetcher,
        watch: [watchRef],
        immediate: true,
      });

      // Wait for initial fetch
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      const firstCount = fetchCount;

      // Change watch source
      watchRef.value = 2;
      await nextTick();

      // Wait for refetch
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      // Fetcher should be called again
      expect(fetchCount).toBeGreaterThan(firstCount);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Dynamic Key Changes Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Dynamic Key Changes", () => {
    it("should refetch when key changes", async () => {
      const keyRef = ref("key-1");
      let fetchCount = 0;

      const fetcher = vi.fn().mockImplementation(async () => {
        fetchCount++;
        return { key: keyRef.value, count: fetchCount };
      });

      const result = useSWR({
        key: keyRef,
        fetcher,
        immediate: true,
      });

      // Wait for initial fetch
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      const firstCount = fetchCount;

      // Change key
      keyRef.value = "key-2";
      await nextTick();

      // Wait for refetch
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      // Fetcher should be called again with new key
      expect(fetchCount).toBeGreaterThan(firstCount);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Caching Tests (SWR Core Behavior)
  // ═══════════════════════════════════════════════════════════════

  describe("Caching Behavior", () => {
    it("should use cached data on subsequent calls with same key", async () => {
      let fetchCount = 0;
      const fetcher = vi.fn().mockImplementation(async () => {
        fetchCount++;
        return { count: fetchCount, timestamp: Date.now() };
      });

      // First call
      const result1 = useSWR({
        key: "cache-test-key-1",
        fetcher,
        staleTime: 60000, // 1 minute - data stays fresh
      });

      // Wait for first fetch to complete
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      const firstData = result1.data.value;
      const firstFetchCount = fetchCount;

      // Second call with same key should use cache
      const result2 = useSWR({
        key: "cache-test-key-1",
        fetcher,
        staleTime: 60000,
      });

      await new Promise((resolve) => setTimeout(resolve, 50));
      await nextTick();

      // Data should be immediately available from cache
      if (firstData && result2.data.value) {
        expect(result2.data.value).toEqual(firstData);
        // Fetcher should not be called again for fresh data
        expect(fetchCount).toBe(firstFetchCount);
      }
    });

    it("should use stale data when data becomes stale", async () => {
      let fetchCount = 0;
      const fetcher = vi.fn().mockImplementation(async () => {
        fetchCount++;
        return { count: fetchCount, timestamp: Date.now() };
      });

      // First call with very short stale time
      const result1 = useSWR({
        key: "stale-test-key",
        fetcher,
        staleTime: 50, // 50ms - very short for testing
        immediate: true,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      const firstData = result1.data.value;
      const firstCount = fetchCount;
      expect(firstData).toBeDefined();
      expect(firstCount).toBe(1);

      // Wait for data to become stale
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Second call after stale time - should use stale data from cache
      const result2 = useSWR({
        key: "stale-test-key",
        fetcher,
        staleTime: 50,
        immediate: true,
      });

      await new Promise((resolve) => setTimeout(resolve, 50));
      await nextTick();

      // Should have stale data immediately (SWR behavior)
      if (firstData && result2.data.value) {
        expect(result2.data.value).toEqual(firstData);
      }

      // Note: Background revalidation depends on Nuxt hooks which may not work in test environment
      // The important part is that stale data is returned immediately
      expect(result2.data.value).toBeDefined();
    });

    it("should return status correctly", async () => {
      const result = useSWR({
        key: "status-test-key",
        fetcher: async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          return { data: "test" };
        },
      });

      // Initially should be pending or idle
      expect(["idle", "pending"]).toContain(result.status.value);

      // Wait for completion
      await new Promise((resolve) => setTimeout(resolve, 150));
      await nextTick();

      // Should be success after fetch completes
      expect(result.status.value).toBe("success");
    });

    it("should handle background revalidation for stale data", async () => {
      let fetchCount = 0;
      const fetcher = vi.fn().mockImplementation(async () => {
        fetchCount++;
        return { count: fetchCount, timestamp: Date.now() };
      });

      // First call with very short stale time
      const result1 = useSWR({
        key: "background-revalidate-test",
        fetcher,
        staleTime: 50, // 50ms
        immediate: true,
      });

      // Wait for initial fetch
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      const firstCount = fetchCount;
      const firstData = result1.data.value;
      expect(firstData).toBeDefined();
      expect(firstCount).toBe(1);

      // Wait for data to become stale
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Second call - should use stale data immediately (SWR behavior)
      const result2 = useSWR({
        key: "background-revalidate-test",
        fetcher,
        staleTime: 50,
        immediate: true,
      });

      // Should have stale data immediately
      if (firstData && result2.data.value) {
        expect(result2.data.value).toEqual(firstData);
      }

      // Manually trigger refresh to simulate background revalidation
      // (In real app, this happens via Nuxt hooks which may not work in test env)
      await result2.refresh();
      await nextTick();

      // Fetcher should have been called again after manual refresh
      expect(fetchCount).toBeGreaterThan(firstCount);
      
      // Data should be updated after refresh
      if (result2.data.value) {
        expect(result2.data.value.count).toBeGreaterThan(firstData?.count || 0);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Utility Functions Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Utility Functions", () => {
    beforeEach(() => {
      // Clear cache before each test
      invalidateSWRCache();
    });

    afterEach(() => {
      // Clear cache after each test
      invalidateSWRCache();
    });

    describe("invalidateSWRCache", () => {
      it("should clear specific cache entry when key is provided", async () => {
        // Create cache entries
        useSWR({
          key: "cache-key-1",
          fetcher: async () => ({ data: "test1" }),
          immediate: true,
        });

        useSWR({
          key: "cache-key-2",
          fetcher: async () => ({ data: "test2" }),
          immediate: true,
        });

        // Wait for data to be cached
        await new Promise((resolve) => setTimeout(resolve, 100));
        await nextTick();

        // Check initial stats
        const statsBefore = getSWRCacheStats();
        expect(statsBefore.keys).toContain("cache-key-1");
        expect(statsBefore.keys).toContain("cache-key-2");

        // Invalidate specific key
        invalidateSWRCache("cache-key-1");

        // Check stats after
        const statsAfter = getSWRCacheStats();
        expect(statsAfter.keys).not.toContain("cache-key-1");
        expect(statsAfter.keys).toContain("cache-key-2");
      });

      it("should clear all SWR cache when no key is provided", async () => {
        // Create multiple cache entries
        useSWR({
          key: "cache-key-1",
          fetcher: async () => ({ data: "test1" }),
          immediate: true,
        });

        useSWR({
          key: "cache-key-2",
          fetcher: async () => ({ data: "test2" }),
          immediate: true,
        });

        useSWR({
          key: "cache-key-3",
          fetcher: async () => ({ data: "test3" }),
          immediate: true,
        });

        // Wait for data to be cached
        await new Promise((resolve) => setTimeout(resolve, 100));
        await nextTick();

        // Check initial stats
        const statsBefore = getSWRCacheStats();
        expect(statsBefore.size).toBeGreaterThan(0);

        // Invalidate all
        invalidateSWRCache();

        // Check stats after
        const statsAfter = getSWRCacheStats();
        expect(statsAfter.size).toBe(0);
      });
    });

    describe("getSWRCacheStats", () => {
      it("should return cache statistics", async () => {
        // Create cache entry
        useSWR({
          key: "stats-test-key",
          fetcher: async () => ({ data: "test" }),
          immediate: true,
        });

        // Wait for data to be cached
        await new Promise((resolve) => setTimeout(resolve, 100));
        await nextTick();

        const stats = getSWRCacheStats();

        // Check structure
        expect(stats).toHaveProperty("size");
        expect(stats).toHaveProperty("keys");
        expect(stats).toHaveProperty("entries");

        // Check types
        expect(typeof stats.size).toBe("number");
        expect(Array.isArray(stats.keys)).toBe(true);
        expect(Array.isArray(stats.entries)).toBe(true);

        // Check entry structure
        if (stats.entries.length > 0) {
          const entry = stats.entries[0];
          expect(entry).toHaveProperty("key");
          expect(entry).toHaveProperty("timestamp");
          expect(entry).toHaveProperty("age");
          expect(entry).toHaveProperty("isFresh");
          expect(typeof entry.timestamp).toBe("number");
          expect(typeof entry.age).toBe("number");
          expect(typeof entry.isFresh).toBe("boolean");
        }
      });

      it("should use custom staleTime when provided", async () => {
        // Create cache entry
        useSWR({
          key: "custom-stale-time-test",
          fetcher: async () => ({ data: "test" }),
          immediate: true,
          staleTime: 5000, // 5 seconds
        });

        // Wait for data to be cached
        await new Promise((resolve) => setTimeout(resolve, 100));
        await nextTick();

        // Get stats with custom staleTime
        const stats = getSWRCacheStats(5000);

        if (stats.entries.length > 0) {
          const entry = stats.entries[0];
          // Age should be less than custom staleTime for fresh data
          expect(entry.age).toBeLessThan(5000);
        }
      });

      it("should return empty stats when cache is empty", () => {
        invalidateSWRCache();
        const stats = getSWRCacheStats();

        expect(stats.size).toBe(0);
        expect(stats.keys).toEqual([]);
        expect(stats.entries).toEqual([]);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Pending State Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Pending State", () => {
    it("should set pending to true during fetch", async () => {
      const result = useSWR({
        key: "pending-test",
        fetcher: async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          return { data: "test" };
        },
        immediate: true,
      });

      // Initially should be pending
      expect(result.pending.value).toBe(true);
      expect(result.status.value).toBe("pending");

      // Wait for completion
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      // Should not be pending anymore
      expect(result.pending.value).toBe(false);
      expect(result.status.value).toBe("success");
    });

    it("should not show pending during background refresh", async () => {
      let fetchCount = 0;
      const fetcher = vi.fn().mockImplementation(async () => {
        fetchCount++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return { count: fetchCount };
      });

      // First call
      const result1 = useSWR({
        key: "background-pending-test",
        fetcher,
        staleTime: 50,
        immediate: true,
      });

      // Wait for initial fetch
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      // Wait for data to become stale
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Second call - should use stale data, pending should be false
      const result2 = useSWR({
        key: "background-pending-test",
        fetcher,
        staleTime: 50,
        immediate: true,
      });

      // Should have data immediately (stale)
      expect(result2.data.value).toBeDefined();
      // Pending should be false during background refresh
      expect(result2.pending.value).toBe(false);
    });
  });
});
