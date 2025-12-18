<script setup lang="ts">
import { computed } from "vue";
import { useSelectContext } from "./context";

const ctx = useSelectContext("SelectValue");

const text = computed(() => ctx.selectedLabel.value || ctx.placeholder.value);

const isPlaceholder = computed(() => !ctx.selectedLabel.value);
</script>

<template>
  <span
    :data-placeholder="isPlaceholder ? '' : undefined"
    :class="['truncate text-left', isPlaceholder ? 'text-slate-400' : 'text-slate-900']"
  >
    <slot>{{ text }}</slot>
  </span>
</template>
