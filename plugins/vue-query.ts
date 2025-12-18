import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  // Create a new QueryClient for each request (SSR-safe)
  // On server, each request gets a new instance
  // On client, we can reuse the same instance
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  // Cleanup on app unmount (client-side only)
  if (process.client) {
    nuxtApp.hook("app:beforeUnmount", () => {
      queryClient.clear();
    });
  }
});
