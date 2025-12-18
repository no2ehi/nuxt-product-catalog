<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    class?: string;
  }>(),
  {}
);

const classes = computed(() => {
  const baseClasses = "animate-pulse rounded-md bg-slate-200 dark:bg-slate-800";
  return props.class ? `${baseClasses} ${props.class}` : baseClasses;
});
</script>

<template>
  <div v-bind="$attrs" :class="classes" />
</template>
