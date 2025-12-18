<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const showButton = ref(false);
let scrollHandler: (() => void) | null = null;

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  scrollHandler = () => {
    showButton.value = window.scrollY > 300;
  };
  window.addEventListener("scroll", scrollHandler);
});

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
  }
});
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <button
      v-if="showButton"
      type="button"
      class="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:scale-110 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Scroll to top of page"
      @click="scrollToTop"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  </Transition>
</template>
