<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useSelectContext } from "./context";

const ctx = useSelectContext("SelectTrigger");
const triggerRef = ref<HTMLElement | null>(null);

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-3 text-sm",
  lg: "h-11 px-4 text-base",
};

onMounted(() => {
  ctx.triggerEl.value = triggerRef.value;
});

const onKeydown = (event: KeyboardEvent) => {
  if (ctx.disabled.value) return;
  const key = event.key;
  if (key === "Enter" || key === " ") {
    event.preventDefault();
    ctx.toggle();
  } else if (key === "ArrowDown") {
    event.preventDefault();
    if (!ctx.open.value) ctx.openSelect();
    ctx.highlightNext();
  } else if (key === "ArrowUp") {
    event.preventDefault();
    if (!ctx.open.value) ctx.openSelect();
    ctx.highlightPrev();
  } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    ctx.typeahead(key);
  }
};
</script>

<template>
  <button
    ref="triggerRef"
    type="button"
    :aria-expanded="ctx.open.value"
    :aria-haspopup="true"
    :disabled="ctx.disabled.value"
    :data-state="ctx.open.value ? 'open' : 'closed'"
    :class="[
      'flex w-full items-center justify-between gap-2 rounded-md border bg-white text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60',
      ctx.invalid.value ? 'border-red-500' : 'border-slate-300 hover:bg-slate-50',
      sizeClasses[ctx.size.value],
    ]"
    @click="ctx.toggle"
    @keydown="onKeydown"
  >
    <slot />
    <span class="text-slate-400">
      <svg
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="m6 8 4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  </button>
</template>
