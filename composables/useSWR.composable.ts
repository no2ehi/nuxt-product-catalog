import type { MaybeRef, WatchSource, Ref } from "vue";
import { unref, computed, watch, onUnmounted, ref } from "vue";
import type { AsyncDataOptions } from "#app";

interface SWRCacheWrapper<T> {
  __data: T;
  __ts: number;
}

interface UseSWROptions<T> {
  key: MaybeRef<string | (() => string)>;
  fetcher: () => Promise<T>;
  watch?: WatchSource[];
  immediate?: boolean;
  server?: boolean;
  /** Time in milliseconds before data becomes stale (default: 2 minutes) */
  staleTime?: number;
  /** Revalidate on mount even if data is fresh (default: false) */
  revalidateOnMount?: boolean;
  /** Revalidate when window regains focus (default: false) */
  revalidateOnFocus?: boolean;
}

interface UseSWRReturn<T> {
  data: Ref<T | null>;
  pending: Ref<boolean>;
  error: Ref<Error | null>;
  status: Ref<"idle" | "pending" | "success" | "error">;
  refresh: () => Promise<void>;
  invalidate: () => Promise<void>;
}

export const useSWR = <T>({
  key,
  fetcher,
  watch: watchSources = [],
  immediate = true,
  server = true,
  staleTime = 2 * 60 * 1000, // 2 minutes default
  revalidateOnMount = false,
  revalidateOnFocus = false,
}: UseSWROptions<T>): UseSWRReturn<T> => {
  const nuxtApp = useNuxtApp();

  // Resolve key to a computed string
  const resolvedKey = computed(() => {
    const k = unref(key);
    return typeof k === "function" ? k() : k;
  });

  const isFresh = (timestamp: number): boolean => {
    return Date.now() - timestamp < staleTime;
  };

  const getCached = (): SWRCacheWrapper<T> | undefined => {
    return nuxtApp.payload.data[resolvedKey.value] as SWRCacheWrapper<T> | undefined;
  };

  // Build useAsyncData options
  const asyncDataOptions: AsyncDataOptions<SWRCacheWrapper<T>> = {
    server,
    immediate,
    watch: [resolvedKey, ...watchSources], // Watch key changes!

    getCachedData: (cacheKey) => {
      const cached = nuxtApp.payload.data[cacheKey] as SWRCacheWrapper<T> | undefined;

      // No cached data - need to fetch
      if (!cached?.__ts) return undefined;

      // If revalidateOnMount is true, don't use cache on initial hydration
      if (revalidateOnMount && nuxtApp.isHydrating) return undefined;

      // SWR: Always return cached data if exists (even if stale)
      // Background revalidation will be handled separately
      return cached;
    },
  };

  // Wrapped fetcher that adds timestamp
  const wrappedFetcher = async (): Promise<SWRCacheWrapper<T>> => {
    const data = await fetcher();
    return {
      __data: data,
      __ts: Date.now(),
    };
  };

  // Use getter function for dynamic key in useAsyncData
  const result = useAsyncData(() => resolvedKey.value, wrappedFetcher, asyncDataOptions);

  // Unwrap data for consumer
  const data = computed(() => result.data.value?.__data ?? null);

  // Track if we're doing background revalidation (don't show loading)
  const isBackgroundRefresh = ref(false);

  // Pending should be false during background refresh (SWR behavior)
  const pending = computed(() => {
    if (isBackgroundRefresh.value) return false;
    return result.pending.value;
  });

  // Map status
  const status = computed(() => {
    if (result.status.value === "idle") return "idle";
    if (result.status.value === "pending" && !isBackgroundRefresh.value) return "pending";
    if (result.status.value === "error") return "error";
    return "success";
  });

  // Background revalidation for stale data
  const revalidateIfStale = async () => {
    const cached = getCached();
    if (cached?.__ts && !isFresh(cached.__ts)) {
      isBackgroundRefresh.value = true;
      try {
        await result.refresh();
      } finally {
        isBackgroundRefresh.value = false;
      }
    }
  };

  // Check for stale data after initial load (SWR behavior)
  if (immediate && import.meta.client) {
    // Wait for hydration to complete, then check if stale
    nuxtApp.hook("app:suspense:resolve", () => {
      revalidateIfStale();
    });
  }

  // Refresh function (force refresh)
  const refresh = async (): Promise<void> => {
    await result.refresh();
  };

  // Invalidate: clear cache and refresh
  const invalidate = async (): Promise<void> => {
    await result.clear();
    await result.refresh();
  };

  // Revalidate on focus
  if (revalidateOnFocus && import.meta.client) {
    const handleFocus = () => {
      revalidateIfStale();
    };

    window.addEventListener("focus", handleFocus);

    onUnmounted(() => {
      window.removeEventListener("focus", handleFocus);
    });
  }

  return {
    data,
    pending,
    error: result.error,
    status,
    refresh,
    invalidate,
  };
};

// Utility function to manually invalidate cache
export const invalidateSWRCache = (key?: string) => {
  const nuxtApp = useNuxtApp();
  if (key) {
    delete nuxtApp.payload.data[key];
  } else {
    // Clear all SWR cached data (those with __ts property)
    Object.keys(nuxtApp.payload.data).forEach((k) => {
      const cached = nuxtApp.payload.data[k];
      if (cached && typeof cached === "object" && "__ts" in cached) {
        delete nuxtApp.payload.data[k];
      }
    });
  }
};

// Utility function to get cache stats (for debugging)
export const getSWRCacheStats = (customStaleTime?: number) => {
  const nuxtApp = useNuxtApp();
  const defaultStaleTime = customStaleTime ?? 2 * 60 * 1000;
  const entries: Array<{ key: string; timestamp: number; age: number; isFresh: boolean }> = [];

  Object.keys(nuxtApp.payload.data).forEach((k) => {
    const cached = nuxtApp.payload.data[k];
    if (cached && typeof cached === "object" && "__ts" in cached) {
      const wrapper = cached as SWRCacheWrapper<unknown>;
      entries.push({
        key: k,
        timestamp: wrapper.__ts,
        age: Date.now() - wrapper.__ts,
        isFresh: Date.now() - wrapper.__ts < defaultStaleTime,
      });
    }
  });

  return {
    size: entries.length,
    keys: entries.map((e) => e.key),
    entries,
  };
};
