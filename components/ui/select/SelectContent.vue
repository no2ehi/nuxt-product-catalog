<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useSelectContext } from "./context";

const ctx = useSelectContext("SelectContent");
const contentRef = ref<HTMLElement | null>(null);

onMounted(() => {
  ctx.contentEl.value = contentRef.value;
});

onUnmounted(() => {
  if (ctx.contentEl.value === contentRef.value) {
    ctx.contentEl.value = null;
  }
});

watch(
  () => ctx.open.value,
  (isOpen) => {
    if (isOpen) {
      ctx.highlightValue(ctx.selectedValue.value);
      nextTick(() => contentRef.value?.focus());
    }
  }
);

const onKeydown = (event: KeyboardEvent) => {
  if (!ctx.open.value) return;
  const key = event.key;
  if (key === "ArrowDown") {
    event.preventDefault();
    ctx.highlightNext();
  } else if (key === "ArrowUp") {
    event.preventDefault();
    ctx.highlightPrev();
  } else if (key === "Enter") {
    event.preventDefault();
    if (ctx.highlightedValue.value !== null) {
      ctx.selectValue(ctx.highlightedValue.value);
    }
  } else if (key === "Escape") {
    event.preventDefault();
    ctx.closeSelect(true);
  } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    ctx.typeahead(key);
  }
};
</script>

<template>
  <div
    ref="contentRef"
    :aria-hidden="!ctx.open.value"
    :tabindex="ctx.open.value ? -1 : undefined"
    role="listbox"
    :aria-activedescendant="
      ctx.open.value && ctx.highlightedValue.value !== null
        ? String(ctx.highlightedValue.value)
        : undefined
    "
    :class="[
      'absolute z-50 mt-2 max-h-60 w-full min-w-[12rem] overflow-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg focus:outline-none transition-all duration-150 ease-out',
      ctx.open.value
        ? 'opacity-100 pointer-events-auto visible translate-y-0'
        : 'opacity-0 pointer-events-none invisible -translate-y-1',
    ]"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
