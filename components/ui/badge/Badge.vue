<script setup lang="ts">
import { computed } from "vue";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant;
    class?: string;
  }>(),
  {
    variant: "default",
  }
);

const baseClasses =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300";

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "border-transparent bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
  secondary:
    "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
  destructive:
    "border-transparent bg-red-500 text-slate-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80",
  outline: "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800",
};

const classes = computed(() => {
  return [baseClasses, variantClasses[props.variant], props.class].filter(Boolean).join(" ");
});
</script>

<template>
  <span v-bind="$attrs" :class="classes">
    <slot />
  </span>
</template>
